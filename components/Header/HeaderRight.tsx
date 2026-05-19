"use client";
import { useDrawer } from "@/context/DrawerContext";
import { Fragment } from "react";
import { Menu, ShoppingCart, UserRound } from "lucide-react";
import MainButton from "../Button/MainButton";
import Link from "next/link";
import { Text } from "../Text/Text";
import { useNavigation } from "@/hooks/useNavigation";
import { useParams } from "next/navigation";

export default function HeaderRight() {
  const { openDrawer } = useDrawer();
  const { navigateTo } = useNavigation();
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";

  const isLoggedIn = false;

  return (
    <div className="flex items-center gap-4">
      {!isLoggedIn && (
        <MainButton
          text="Ingresar"
          size="sm"
          variant="outline"
          rightIcon={UserRound}
          onClick={() => navigateTo({ route: `/${lang}/login` })}
        />
      )}
      {isLoggedIn && (
        <Fragment>
          <ShoppingCart color="#fff" />
          <Link href="/profile">
            <Text variant="span" size="base" weight="semibold" color="white">
              Hola Ignacio!
            </Text>
          </Link>
          <div className="flex lg:hidden items-center justify-center cursor-pointer">
            <Menu onClick={openDrawer} />
          </div>
        </Fragment>
      )}
    </div>
  );
}
