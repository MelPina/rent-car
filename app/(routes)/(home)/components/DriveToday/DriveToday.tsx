import { Button } from "@/components/ui/button";
// import Image from "next/image";
import Link from "next/link";
export function DriveToday() {
    return (
        <div className="p-6 lg:my-32 max-w-7xl mx-auto">
            <div className="bg-[url('/images/background-2.jpg')] bg-center bg-no-repeat bg-cover
rounded-xl p-6 lg:p-32 relative">
                <div className="lg:flex gap-x-6 ">
                    <div>
                        <h3 className="text-4xl text-white">Conduce el auto de tus sueños hoy</h3>
                        <p className="text-white text-xl my-5">
                            Regístrate y explora el mundo de los autos más confortables.
                        </p>

                        <Link href="/sign-in">
                            <Button variant="outline" size="lg">
                                Registrarme
                            </Button>
                        </Link>

                    </div>
                    <div className="lg:absolute lg:-right-32 top-5">
                        {/* <Image
                            src="/images/car5.png"
                            alt="Car Drive"
                            width={550}
                            height={250} /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
