import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import AuthShowcase from "~/components/auth-showcase";
import Header from "~/components/layout/header";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
  <div className="">
    <Header />
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <div>
      bids:
    </div>
    <div>
      payments: 
    </div>
    <div>
      ballence:
    </div>
    <button>payout</button>
      <AuthShowcase />
    </div>
    <div>
     
    </div>
  </div>
)
}

