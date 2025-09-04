"use client";
import JigsawGame from "./JigsawGame";

export default function Home() {

  return (
    <div className="w-full h-[100vh] bg-[url('https://media.discordapp.net/attachments/1360666377878372432/1411441434300776488/image.png?ex=68b4aac5&is=68b35945&hm=64ea0eac87703102fb20db66371bda4dc4d71d5563694526904efe869d5b6bba&=&format=webp&quality=lossless')] bg-cover bg-center">
      <JigsawGame />
    </div>
  );
}