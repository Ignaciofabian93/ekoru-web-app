/**
 * Webpay Plus requires the buyer to arrive at Transbank's hosted form via an
 * HTTP form-POST carrying `token_ws` (it does not accept GET). Shared by every
 * flow that hands off to Webpay — cart checkout and subscription payments.
 */
export function submitWebpayForm(url: string, token: string): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "token_ws";
  input.value = token;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
