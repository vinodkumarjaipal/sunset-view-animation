    // DOM Elements
        const toggleAnimationBtn = document.getElementById('toggle-animation');
        const changeGradientBtn = document.getElementById('change-gradient');
        const toggleStarsBtn = document.getElementById('toggle-stars');
        const randomGradientBtn = document.getElementById('random-gradient');
        const speedBtns = document.querySelectorAll('.speed-btn');
        const starsContainer = document.getElementById('stars');
        const gradientCounter = document.getElementById('gradient-counter');
        
        // Animation elements
        const sunContainer = document.querySelector('.sun-container');
        const moonContainer = document.querySelector('.moon-container');
        const gradients = document.querySelectorAll('.sunset-gradient');
        const skyElement = document.querySelector('.sky');
        
        // Gradient names
        const gradientNames = [
            'Classic Orange', 'Golden Orange', 'Orange Violet', 'Ocean Blue',
            'Reddish Orange', 'Golden Hour', 'Bluish Green', 'Violet Dusk',
            'Deep Red', 'Purple Fusion', 'Amber Ember', 'Magenta Sky'
        ];
        
        // State
        let isPlaying = true;
        let currentGradient = 0;
        let starsVisible = false;
        let animationSpeed = 1;
        
        // Audio state
        let isPlayingAudio = false;
        
        // Audio elements
        const bgAudio = document.getElementById('bgAudio');
        const audioToggleBtn = document.getElementById('audioToggleBtn');
        const audioIcon = document.getElementById('audioIcon');
        const audioText = document.getElementById('audioText');
        const audioWarning = document.getElementById('audioWarning');
        
        // Create stars
        function createStars() {
            starsContainer.innerHTML = '';
            for (let i = 0; i < 120; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 70}%`;
                const size = Math.random() * 2 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`;
                starsContainer.appendChild(star);
            }
        }
        
        // Change gradient
        function changeGradient(direction = 'next') {
            gradients.forEach(g => g.style.opacity = '0');
            if (direction === 'next') {
                currentGradient = (currentGradient + 1) % gradients.length;
            }
            gradients[currentGradient].style.opacity = '1';
            gradientCounter.textContent = `${gradientNames[currentGradient]} (${currentGradient + 1}/${gradients.length})`;
        }
        
        // Random gradient
        function randomGradient() {
            gradients.forEach(g => g.style.opacity = '0');
            let newGradient;
            do {
                newGradient = Math.floor(Math.random() * gradients.length);
            } while (newGradient === currentGradient && gradients.length > 1);
            currentGradient = newGradient;
            gradients[currentGradient].style.opacity = '1';
            gradientCounter.textContent = `${gradientNames[currentGradient]} (${currentGradient + 1}/${gradients.length})`;
        }
        
        // Toggle stars
        function toggleStars() {
            starsVisible = !starsVisible;
            starsContainer.style.opacity = starsVisible ? '1' : '0';
            toggleStarsBtn.innerHTML = starsVisible ? '✨ Hide' : '✨ Show';
        }
        
        // Toggle animation
        function toggleAnimation() {
            isPlaying = !isPlaying;
            const playingText = toggleAnimationBtn.querySelector('.playing');
            const pausedText = toggleAnimationBtn.querySelector('.paused');
            
            [sunContainer, moonContainer].forEach(el => {
                el.classList.toggle('paused', !isPlaying);
            });
            
            if (isPlaying) {
                playingText.style.display = 'inline';
                pausedText.style.display = 'none';
            } else {
                playingText.style.display = 'none';
                pausedText.style.display = 'inline';
            }
        }
        
        // Change speed
        function changeSpeed(speed) {
            animationSpeed = speed;
            sunContainer.style.animationDuration = `${30 / speed}s`;
            moonContainer.style.animationDuration = `${30 / speed}s`;
            
            speedBtns.forEach(btn => {
                btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
            });
        }
        
        
        async function toggleAudio() {
            try {
                if (!isPlayingAudio) {
                    // Try to play
                    await bgAudio.play();
                    isPlayingAudio = true;
                    audioIcon.textContent = '⏸️';
                    audioText.textContent = 'Pause Music';
                    audioWarning.classList.remove('visible');
                } else {
                    bgAudio.pause();
                    isPlayingAudio = false;
                    audioIcon.textContent = '🎵';
                    audioText.textContent = 'Play Music';
                }
            } catch (error) {
                console.log('Audio error:', error);
                audioWarning.textContent = '⚠️ Click again to play (browser needs interaction)';
                audioWarning.classList.add('visible');
                
                // Retry once
                setTimeout(async () => {
                    try {
                        await bgAudio.play();
                        isPlayingAudio = true;
                        audioIcon.textContent = '⏸️';
                        audioText.textContent = 'Pause Music';
                        audioWarning.classList.remove('visible');
                    } catch (e) {
                        console.log('Retry failed');
                    }
                }, 300);
            }
        }

        // Audio event listeners
        bgAudio.addEventListener('canplaythrough', () => {
            audioWarning.textContent = '🎵 Click "Play Music" for ambient soundtrack';
            audioWarning.classList.add('visible');
        });

        bgAudio.addEventListener('error', () => {
            audioWarning.textContent = '⚠️ Audio unavailable. Enjoy the visual sunset.';
            audioWarning.classList.add('visible');
        });

        // Audio toggle button
        audioToggleBtn.addEventListener('click', toggleAudio);

        
        // EVENT LISTENERS
        
        toggleAnimationBtn.addEventListener('click', toggleAnimation);
        changeGradientBtn.addEventListener('click', () => changeGradient('next'));
        toggleStarsBtn.addEventListener('click', toggleStars);
        randomGradientBtn.addEventListener('click', randomGradient);
        
        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => changeSpeed(parseFloat(btn.dataset.speed)));
        });
        
        // Touch screen  detection
        let touchStartX = 0;
        
        skyElement.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        skyElement.addEventListener('touchend', (e) => {
            if (touchStartX === 0) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    gradients.forEach(g => g.style.opacity = '0');
                    currentGradient = (currentGradient - 1 + gradients.length) % gradients.length;
                    gradients[currentGradient].style.opacity = '1';
                    gradientCounter.textContent = `${gradientNames[currentGradient]} (${currentGradient + 1}/${gradients.length})`;
                } else {
                    changeGradient('next');
                }
            }
            touchStartX = 0;
        }, { passive: true });
        
        // Initialize
        createStars();
        changeSpeed(1);
        
        // Auto-cycle gradients
        setInterval(() => changeGradient('next'), 15000);
