// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import Rails from "@rails/ujs"
Rails.start()

import "hamburger_menu"


// ダッシュボードタスク作成用
document.addEventListener('turbo:load', () => {
  const modal = document.getElementById('task-modal');
  const openButton = document.getElementById('open-modal');
  const closeButton = document.getElementById('close-modal');

  if (modal && openButton && closeButton) {
    // モーダルを開く
    openButton.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    // モーダルを閉じる
    closeButton.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    // モーダルの外をクリックして閉じる
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
});
