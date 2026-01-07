export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-orange-500  justify-center">
      {children}
    </div>
  )
}
