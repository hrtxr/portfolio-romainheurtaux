function toggleMenu() {
    var menu = document.getElementById('menu');
    menu.classList.toggle('show');
}


/// 3D Card Effect
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        const offsetX = mouseX / 16;
        const offsetY = mouseY / 16;

        card.style.transform = `rotateY(${offsetX}deg) rotateX(${-offsetY}deg)`;
    });

    card.addEventListener('mouseleave', function() {
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
});