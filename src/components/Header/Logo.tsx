import Image from "next/image";

interface LogoProps {
  isBig: boolean;
}

export default function Logo({ isBig }: LogoProps) {
  if (isBig) {
    return (
      <Image src="/TodoList-Logo.png" width={280} height={130} alt="Logo" />
    );
  } else {
    return (
      <Image
        src="/TodoList-Logo.png"
        width={130}
        height={60}
        alt="Logo"
        style={{ marginRight: "10px" }}
      />
    );
  }
}
