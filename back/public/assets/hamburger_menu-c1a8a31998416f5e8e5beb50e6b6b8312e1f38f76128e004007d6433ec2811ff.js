document.addEventListener('turbo:load', () => {
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const dropdownMenu = document.getElementById('hamburger-dropdown');
  const overlay = document.getElementById('overlay');
  const missionsMenu = document.getElementById('missions-menu');
  const missionsDropdown = document.getElementById('missions-dropdown');

  if (hamburgerIcon && dropdownMenu && overlay) {
    // ハンバーガーメニューの開閉
    hamburgerIcon.addEventListener('click', () => {
      dropdownMenu.classList.toggle('-translate-x-full');
      overlay.classList.toggle('hidden');
    });

    // オーバーレイをクリックしてモーダルを閉じる
    overlay.addEventListener('click', () => {
      dropdownMenu.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    });
  }

  if (missionsMenu && missionsDropdown) {
    // Missions プルダウンメニューの開閉
    missionsMenu.addEventListener('click', (event) => {
      event.stopPropagation();
      missionsDropdown.classList.toggle('hidden');
    });
  }
});
