import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prepareImage, toImageUploadError, type ImageUploadError } from "./imageUpload";

const MB = 1024 * 1024;
const photo = (type: string, bytes = 1000, name = "photo") =>
  new File([new Uint8Array(bytes)], name, { type });

/** The browser decodes every image as `width`×`height`. */
const decodesAs = (width: number, height: number) =>
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn().mockResolvedValue({ width, height, close: vi.fn() }),
  );

/** A canvas whose JPEG comes out `bytes` long; returns the canvas. */
const canvasMaking = (bytes: number) => {
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({ fillRect: vi.fn(), drawImage: vi.fn(), fillStyle: "" }),
    toBlob: (done: (blob: Blob) => void, type: string) =>
      done(new Blob([new Uint8Array(bytes)], { type })),
  };
  vi.spyOn(document, "createElement").mockReturnValue(
    canvas as unknown as HTMLCanvasElement,
  );
  return canvas;
};

const problemOf = (promise: Promise<unknown>) =>
  promise.then(
    () => null,
    (error: ImageUploadError) => error.problem,
  );

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("prepareImage", () => {
  it("sends a JPEG within the limits as it is", async () => {
    decodesAs(4000, 3000);
    const file = photo("image/jpeg");
    expect(await prepareImage(file)).toBe(file);
  });

  it("refuses a file that isn't an image", async () => {
    expect(await problemOf(prepareImage(photo("application/pdf")))).toBe("format");
  });

  it("refuses a HEIC photo the browser can't read", async () => {
    vi.stubGlobal("createImageBitmap", vi.fn().mockRejectedValue(new Error("decode")));
    expect(await problemOf(prepareImage(photo("image/heic")))).toBe("format");
  });

  it("leaves a JPEG the browser can't decode to the server, unless over 10 MB", async () => {
    vi.stubGlobal("createImageBitmap", vi.fn().mockRejectedValue(new Error("decode")));
    const file = photo("image/jpeg");
    expect(await prepareImage(file)).toBe(file);
    expect(await problemOf(prepareImage(photo("image/jpeg", 11 * MB)))).toBe("tooHeavy");
  });

  it("shrinks a heavy phone photo to a 3000 px JPEG", async () => {
    decodesAs(8000, 6000);
    const canvas = canvasMaking(2 * MB);
    const result = await prepareImage(photo("image/jpeg", 12 * MB, "IMG_0001.jpeg"));
    expect(result.type).toBe("image/jpeg");
    expect(result.name).toBe("IMG_0001.jpg");
    expect(result.size).toBe(2 * MB);
    expect([canvas.width, canvas.height]).toEqual([3000, 2250]);
  });

  it("turns a HEIC the browser reads (Safari) into a JPEG", async () => {
    decodesAs(1200, 900);
    const canvas = canvasMaking(500_000);
    const result = await prepareImage(photo("image/heic", 3 * MB, "IMG_0002.HEIC"));
    expect(result.name).toBe("IMG_0002.jpg");
    expect([canvas.width, canvas.height]).toEqual([1200, 900]);
  });

  it("decodes a prepared file only once", async () => {
    decodesAs(800, 600);
    const file = await prepareImage(photo("image/png"));
    await prepareImage(file);
    expect(createImageBitmap).toHaveBeenCalledTimes(1);
  });
});

describe("toImageUploadError", () => {
  const failed = (status: number, data: unknown = {}) =>
    new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
      status,
      data,
      statusText: "",
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

  it.each([
    [failed(400, { code: "IMAGE_FORMAT" }), "format"],
    [failed(400, { code: "IMAGE_TOO_LARGE" }), "tooLarge"],
    [failed(400, { code: "IMAGE_UNREADABLE" }), "unreadable"],
    [failed(413, { message: "File too large" }), "tooHeavy"],
    [failed(401), "session"],
    [failed(422), "unreadable"],
    [failed(500), "failed"],
    [new AxiosError("Network Error"), "failed"],
    [new Error("boom"), "failed"],
  ])("reads %s as %s", (error, problem) => {
    expect(toImageUploadError(error).problem).toBe(problem);
  });
});
