document.addEventListener('DOMContentLoaded', function() {
    const mainWrapper = document.querySelector('.main-swiper .swiper-wrapper');
    const thumbWrapper = document.querySelector('.thumb-swiper .swiper-wrapper');
    let mainSwiper = null;
    let thumbSwiper = null;

    // 获取img文件夹中的所有图片
    async function loadImages() {
        try {
            // 获取img目录下的所有图片
            const response = await fetch('img/');
            const files = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(files, 'text/html');
            const links = doc.querySelectorAll('a');
            
            // 过滤出图片文件
            const imageFiles = Array.from(links)
                .map(link => link.href)
                .filter(href => href.match(/\.(jpg|jpeg|png|gif)$/i))
                .filter(href => !href.includes('by-home')); // 排除封面图片

            // 添加到轮播
            imageFiles.forEach(imgPath => {
                mainWrapper.innerHTML += `
                    <div class="swiper-slide">
                        <img src="${imgPath}" alt="照片">
                    </div>
                `;

                thumbWrapper.innerHTML += `
                    <div class="swiper-slide">
                        <img src="${imgPath}" alt="照片">
                    </div>
                `;
            });

            // 初始化轮播器
            initSwipers();
        } catch (error) {
            console.error('加载图片失败:', error);
        }
    }

    // 初始化轮播
    function initSwipers() {
        if (mainSwiper) {
            mainSwiper.destroy();
        }
        if (thumbSwiper) {
            thumbSwiper.destroy();
        }

        mainSwiper = new Swiper('.main-swiper', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            }
        });

        thumbSwiper = new Swiper('.thumb-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 10,
            watchSlidesProgress: true,
        });

        mainSwiper.controller.control = thumbSwiper;
        thumbSwiper.controller.control = mainSwiper;
    }

    // 下载当前图片
    document.querySelector('.download-current').addEventListener('click', function() {
        const currentSlide = mainSwiper.slides[mainSwiper.activeIndex];
        const imgSrc = currentSlide.querySelector('img').src;
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = imgSrc.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 加载所有图片
    loadImages();
});

// 显示选中的图片
function showImage(imagePath) {
    const slides = document.querySelectorAll('.main-swiper .swiper-slide');
    slides.forEach((slide, index) => {
        if (slide.querySelector('img').src.includes(imagePath)) {
            mainSwiper.slideTo(index);
        }
    });
} 