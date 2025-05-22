import Image from "next/image";
import Link from "next/link";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoGrid } from "@/myComponents/PhotoGrid";
import { UploadButton } from "@/myComponents/uploadBTN";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8f7f3" }}>
      <header
        style={{
          borderBottom: "1px solid #669d31",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(4px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-serif"
            style={{ color: "#11270b" }}
          >
            Nelson & Yashalee
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              style={{
                borderColor: "#669d31",
                color: "#3c5a14",
                backgroundColor: "#f8f7f3",
              }}
            >
              <Link href="/acceder">Acceder Cuenta</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 mx-auto">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1
            className="mb-4 text-4xl font-serif font-bold"
            style={{ color: "#11270b" }}
          >
            Nelson & Yashalee
          </h1>
          <p className="mb-6 text-lg" style={{ color: "#669d31" }}>
            Mayo 24, 2025
          </p>
          <div className="relative w-full h-64 mx-auto mb-8 overflow-hidden rounded-lg md:h-96 max-w-3xl">
            <Image
              src="/images/MainWeddingHero.jpeg"
              alt="Nelson & Yashalee Wedding"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="max-w-2xl mx-auto mb-8" style={{ color: "#3c5a14" }}>
            ¡Gracias por ser parte de nuestro día especial! Comparte tus
            momentos y mira las fotos de nuestra boda.
          </p>

          <Link
            className="bg-[#11270b] w-fit flex items-center px-4 py-1 rounded-lg text-white mx-auto h-full  transition-all ease-in-out duration-100 hover:scale-110"
            href={`/subir-fotos`}
            prefetch={true}
          >
            <Camera className=" relative w-4 h-4 mr-2" />
            <p>Comparte tus fotos</p>
          </Link>
        </section>

        {/* Photo Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-serif font-semibold"
              style={{ color: "#11270b" }}
            >
              Memorias de Nuestra Boda
            </h2>
            <Button
              variant="outline"
              style={{
                color: "#598b2c",
                borderColor: "#71b340",
                backgroundColor: "#f8f7f3",
              }}
            >
              Ver todas
            </Button>
          </div>
          <PhotoGrid />
        </section>
      </div>

      <footer
        style={{
          backgroundColor: "#fff",
          borderTop: "1px solid #669d31",
          padding: "1.5rem 0",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <p style={{ color: "#3c5a14" }}>
            © 2025 Nelson & Yashalee. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
