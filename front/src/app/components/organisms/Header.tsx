type HeaderProps = {
  backgroundColor?: string; //背景色
};

export default function Header({ backgroundColor = "bg-black" }: HeaderProps) {
  return (
    <div className={`flex items-center justify-center ${backgroundColor} text-white`}>
      <header className="text-2xl font-bold">Dmission</header>
    </div>
  );
}
