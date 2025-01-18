type FooterProps = {
  backgroundColor?: string; // 背景色
  textColor?: string;       // テキストの色
};

export default function Footer({
  backgroundColor = "bg-primary",
  textColor = "text-white",
}: FooterProps) {
  return (
      <footer className={`${backgroundColor} ${textColor} py-4`}>
        <div className="flex justify-center items-center">
          <a href="/privacy" className="text-lg hover:underline px-4">
            Privacy & Term
          </a>
          <a href="/contact" className="text-lg hover:underline px-4">
            Contact
          </a>
        </div>
        <div className="text-center mt-1 text-sm">
          Copyright © Mick. All rights reserved.
        </div>
      </footer>
  );
}
