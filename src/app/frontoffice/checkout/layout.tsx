import { CheckoutProvider } from "../../context/checkout_context";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CheckoutProvider>{children}</CheckoutProvider>;
}
