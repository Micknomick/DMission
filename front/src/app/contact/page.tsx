"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { SuccessModal } from "@/components/layout/contacts/FormModal";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/v1/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setFormData({ name: "", email: "", message: "" });
        setShowModal(true); // モーダルを表示
      } else {
        console.error("サーバーエラー:", data.errors);
      }
    } catch (error) {
      console.error("ネットワークエラー:", error);
    }
  };

  return (
    <div className="bg-primary text-white h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">お問い合わせ</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">名前</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">メッセージ</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border px-4 py-2 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            送信
          </button>
        </form>
      </div>

      {/* モーダル表示 */}
      <SuccessModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
