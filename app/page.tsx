import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ModeToggle";

export default function Home() {
  return (
    <>
      <div className="m-5 flex gap-2">
        <Button>Click me!</Button>
        <ModeToggle></ModeToggle>
      </div>
    </>
  );
}
