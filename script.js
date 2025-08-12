document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a chapter page, favorites page, or index page
    const isChapterPage = document.body.id && document.body.id.startsWith('chapter-');
    const isFavoritesPage = window.location.pathname.includes('favorites.html');
    const isIndexPage = !isChapterPage && !isFavoritesPage;
    
    // Create FAB container
    const fabContainer = document.createElement('div');
    fabContainer.className = 'fab-container';

    // Build FAB menu based on page type
    let fabMenuHTML = `
        <div class="fab-menu">
    `;
    
    // Add buttons based on page type
    if (isIndexPage) {
        // Index page: View favorites and night mode buttons
        fabMenuHTML += `
            <button id="viewFavoritesBtn" title="View Favorites">⭐</button>
            <button id="modeBtn" title="Toggle Day/Night Mode">🌗</button>
        `;
    } else if (isChapterPage) {
        // Chapter page: Back to index, favorite button, and night mode
        const chapterNumber = document.body.id.replace('chapter-', '');
        const chapterTitle = `Chapter ${chapterNumber}`;
        fabMenuHTML += `
            <button id="backToIndex" title="Back to Index">🏠</button>
            <button id="favoriteBtn" title="Add to Favorites">⭐</button>
            <button id="modeBtn" title="Toggle Day/Night Mode">🌗</button>
        `;
    } else if (isFavoritesPage) {
        // Favorites page: Back to index and night mode buttons
        fabMenuHTML += `
            <button id="backToIndex" title="Back to Index">🏠</button>
            <button id="modeBtn" title="Toggle Day/Night Mode">🌗</button>
        `;
    }
    
    fabMenuHTML += `
        </div>
        <button id="fabMain" class="fab-main">☰</button>
    `;
    
    fabContainer.innerHTML = fabMenuHTML;
    document.body.appendChild(fabContainer);

    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.querySelector('.fab-menu');

    // Set menu to be open by default
    fabMenu.classList.add('open');
    fabMain.textContent = '✕';

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

    // Back to Index button (for chapter and favorites pages)
    if (!isIndexPage) {
        document.getElementById('backToIndex').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Favorite button (only for chapter pages)
    if (isChapterPage) {
        const chapterNumber = document.body.id.replace('chapter-', '');
        const chapterTitle = `Chapter ${chapterNumber}`;
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
    }

    // Day/Night mode button
    const modeBtn = document.getElementById('modeBtn');

    // Check for saved night mode preference
    if (localStorage.getItem('nightMode') === 'enabled') {
        document.body.classList.add('night-mode');
    }

    modeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        if (document.body.classList.contains('night-mode')) {
            localStorage.setItem('nightMode', 'enabled');
        } else {
            localStorage.setItem('nightMode', 'disabled');
        }
    });

    // View Favorites button (for index page)
    if (isIndexPage) {
        document.getElementById('viewFavoritesBtn').addEventListener('click', () => {
            window.location.href = 'favorites.html';
        });
    }

    // Chapter Navigation (only for chapter pages)
    if (isChapterPage) {
        const chapterNavigation = document.createElement('div');
        chapterNavigation.className = 'chapter-navigation';
        chapterNavigation.innerHTML = `
            <button id="prevChapter">Précédent</button>
            <button id="nextChapter">Suivant</button>
        `;
        
        // Find the content area or append to body if not found
        const contentArea = document.querySelector('.content-area') || document.querySelector('.container') || document.body;
        contentArea.appendChild(chapterNavigation);

        const prevChapterBtn = document.getElementById('prevChapter');
        const nextChapterBtn = document.getElementById('nextChapter');

        // Get the chapter number from the body ID
        const currentChapter = parseInt(document.body.id.replace('chapter-', ''));
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

        // Adjust FAB position on scroll
        const fabContainer = document.querySelector('.fab-container');
        window.addEventListener('scroll', () => {
            const chapterNav = document.querySelector('.chapter-navigation');
            if (chapterNav) {
                const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2; // A small tolerance
                if (isAtBottom) {
                    const navHeight = chapterNav.offsetHeight;
                    fabContainer.style.bottom = `${navHeight + 20}px`; // Add some padding
                } else {
                    fabContainer.style.bottom = '20px'; // Reset to default
                }
            }
        });
    }
});
