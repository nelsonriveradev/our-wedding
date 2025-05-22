import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const palette = {
  primary: "#11270b",
  secondary: "#71b340",
  accent: "#669D31",
  accentDark: "#598B2c",
  accentDarker: "#3c5a14",
};
export default function SignIn() {
  return (
    <div className="flex min-h-screen bg-amber-50">
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/placeholder.svg?height=1080&width=720"
          alt="Wedding couple"
          fill
          className="object-cover"
        />
        <div className="absolute -z-10 inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-serif mb-2">Sarah & Michael</h1>
          <p className="text-xl opacity-90">June 15, 2025</p>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1
                className="mb-6 text-3xl font-serif font-bold"
                style={{ color: "#11270b" }}
              >
                Sarah & Michael
              </h1>
              <div
                className="relative w-24 h-24 mx-auto mb-6 overflow-hidden rounded-full border-4"
                style={{ borderColor: "#71b340" }}
              >
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Wedding Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mb-6" style={{ color: "#669D31" }}>
                Sign in to view and share wedding photos
              </p>
            </div>

            <Tabs defaultValue="signin" className="w-full self-end-safe z-40">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#3c5a14] rounded-lg">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-[#71b340] data-[state=active]:text-white text-[#11270b]"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-[#71b340] data-[state=active]:text-white text-[#11270b]"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#3c5a14]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="guest@example.com"
                      required
                      className="focus:border-[#71b340] border-[#598B2c]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#3c5a14]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="focus:border-[#71b340] border-[#598B2c]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#669D31] hover:bg-[#598B2c] text-white font-semibold"
                    asChild
                  >
                    <Link href="/">Sign In</Link>
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-[#3c5a14]">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="guest@example.com"
                      required
                      className="focus:border-[#71b340] border-[#598B2c]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-[#3c5a14]">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      className="focus:border-[#71b340] border-[#598B2c]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#669D31] hover:bg-[#598B2c] text-white font-semibold"
                    asChild
                  >
                    <Link href="/">Sign Up</Link>
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6"></div>
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: "#71b340" }}
              ></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2" style={{ color: "#669D31" }}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full border-[#71b340] text-[#11270b] hover:bg-[#71b340]/10"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#71b340] text-[#11270b] hover:bg-[#71b340]/10"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
