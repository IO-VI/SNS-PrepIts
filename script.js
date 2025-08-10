document.addEventListener('DOMContentLoaded', () => {
    const chapterNumber = document.body.id.replace('chapter-', '');
    const chapterTitle = `Chapter ${chapterNumber}`;

    const fabContainer = document.createElement('div');
    fabContainer.className = 'fab-container';

    fabContainer.innerHTML = `
        <div class="fab-menu">
            <button id="backToIndex" title="Back to Index">🏠</button>
            <button id="favoriteBtn" title="Add to Favorites">⭐</button>
            <button id="modeBtn" title="Toggle Day/Night Mode">🌗</button>
        </div>
        <button id="fabMain" class="fab-main">☰</button>
    `;
    document.body.appendChild(fabContainer);

    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.querySelector('.fab-menu');

    fabMain.addEventListener('click', () => {
        fabMenu.classList.toggle('open');
        fabMain.textContent = fabMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Back to Index button
    document.getElementById('backToIndex').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Favorite button
    const favoriteBtn = document.getElementById('favoriteBtn');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(chapterTitle)) {
        favoriteBtn.innerHTML = '❤️';
        favoriteBtn.title = 'Remove from Favorites';
    }

    favoriteBtn.addEventListener('click', () => {
        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(chapterTitle)) {
            favorites = favorites.filter(fav => fav !== chapterTitle);
            favoriteBtn.innerHTML = '⭐';
            favoriteBtn.title = 'Add to Favorites';
            showNotification('Retiré des favoris');
        } else {
            favorites.push(chapterTitle);
            favoriteBtn.innerHTML = '❤️';
            favoriteBtn.title = 'Remove from Favorites';
            showNotification('Ajouté aux favoris');
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    });

    // Day/Night mode button
    const modeBtn = document.getElementById('modeBtn');
    modeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
    });

    // Chapter Navigation
    const chapterNavigation = document.createElement('div');
    chapterNavigation.className = 'chapter-navigation';
    chapterNavigation.innerHTML = `
        <button id="prevChapter">Précédent</button>
        <button id="nextChapter">Suivant</button>
    `;
    document.querySelector('.content-area').appendChild(chapterNavigation);

    const prevChapterBtn = document.getElementById('prevChapter');
    const nextChapterBtn = document.getElementById('nextChapter');

    const currentChapter = parseInt(chapterNumber);
    const totalChapters = 13; // Assuming 13 chapters

    if (currentChapter === 1) {
        prevChapterBtn.disabled = true;
    } else {
        prevChapterBtn.addEventListener('click', () => {
            window.location.href = `${currentChapter - 1}.html`;
        });
    }

    if (currentChapter === totalChapters) {
        nextChapterBtn.disabled = true;
    } else {
        nextChapterBtn.addEventListener('click', () => {
            window.location.href = `${currentChapter + 1}.html`;
        });
    }
});
