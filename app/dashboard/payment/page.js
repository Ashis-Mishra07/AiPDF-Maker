"use client";

import Image from "next/image";

function Payment() {
  return (
    <div className="relative  h-screen">
      <Image src="/error.jpg" alt="error" layout="fill" objectFit="cover" />
      <p className="absolute top-4 left-4 text-white text-4xl font-bold">
        The Payment Integration has not yet been implemented yet .
        <br /> Access is limited to free tier versions only.
      </p>
    </div>
  );
}
export default Payment;
