
function updateGallery(el) {
    document.getElementById('active-img').src = el.src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

function openZoom() {
    const modal = document.getElementById('zoom-modal');
    document.getElementById('zoom-img').src = document.getElementById('active-img').src;
    modal.style.display = 'flex';
}

function handleOrder(id, name) {
    const text = `Вітаю! Хочу замовити:\n📦 Товар: ${name}\n🆔 ID: ${id}`;
    window.open(`https://t.me/terabiterr?text=${encodeURIComponent(text)}`, '_blank');
}

function submitComment(id) {
    const comment = document.getElementById('user-comment').value;
    if (!comment.trim()) return alert("Будь ласка, введіть текст.");
    const text = `🔔 НОВИЙ ВІДГУК\n📌 Товар ID: ${id}\n💬 Текст: ${comment}`;
    window.open(`https://t.me/terabiterr?text=${encodeURIComponent(text)}`, '_blank');
    document.getElementById('user-comment').value = '';
    alert("Повідомлення надіслано модератору!");
}