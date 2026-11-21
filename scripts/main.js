document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	const siteHeader = document.querySelector('.header');
	const menuButton = document.querySelector('.header__btn-mobile-menu');

	if (siteHeader && menuButton) {
		menuButton.addEventListener('click', function () {
			if (
				document.body.classList.contains('is-cart-open') ||
				document.body.classList.contains('is-diller-modal-open')
			)
				return;

			const isMenuOpen = siteHeader.classList.contains('is-open');

			if (isMenuOpen) {
				closeMobileMenu();
			} else {
				siteHeader.classList.add('is-open');
				menuButton.setAttribute('aria-expanded', 'true');
			}
		});
	}

	const headerDesktopMedia = window.matchMedia('(min-width: 992px)');

	function closeMobileMenu() {
		if (!siteHeader) return;

		siteHeader.classList.remove('is-open');

		if (menuButton) {
			menuButton.setAttribute('aria-expanded', 'false');
		}

		// закрываем открытые пункты каталога
		closeAllCatalogItems();

		// очищаем все поиски
		document.querySelectorAll('.js-search').forEach(function (searchForm) {
			const searchInput = searchForm.querySelector('.js-search-input');
			const searchDropdown = searchForm.querySelector('.js-search-dropdown');

			if (searchInput) {
				searchInput.value = '';
			}

			if (searchDropdown) {
				searchDropdown.classList.remove('is-open');
				searchDropdown.innerHTML = '';
			}
		});
	}

	function handleHeaderDesktopChange(event) {
		if (event.matches) {
			closeMobileMenu();
		}
	}

	headerDesktopMedia.addEventListener('change', handleHeaderDesktopChange);

	if (headerDesktopMedia.matches) {
		closeMobileMenu();
	}

	// header search field
	const searchData = [
		{
			title: 'Аккумуляторная техника',
			category: 'Каталог',
			url: '#battery-tools',
		},
		{
			title: 'Цепные пилы',
			category: 'Каталог',
			url: '#chainsaws',
		},
		{
			title: 'Мотокосы и триммеры',
			category: 'Каталог',
			url: '#trimmers',
		},
		{
			title: 'Бензопилы',
			category: 'Каталог',
			url: '#petrol-saws',
		},
		{
			title: 'Газонокосилки',
			category: 'Каталог',
			url: '#lawn-mowers',
		},
	];

	function renderSearchResults(searchDropdown, items) {
		searchDropdown.innerHTML = '';

		if (!items.length) {
			searchDropdown.innerHTML =
				'<div class="header-search__empty">Ничего не найдено</div>';
			searchDropdown.classList.add('is-open');
			return;
		}

		const resultsMarkup = items
			.map(function (item) {
				return `
        <a class="header-search__item" href="${item.url}">
          <span class="header-search__item-title">${item.title}</span>
          <span class="header-search__item-category">${item.category}</span>
        </a>
      `;
			})
			.join('');

		searchDropdown.innerHTML = resultsMarkup;
		searchDropdown.classList.add('is-open');
	}

	function initSearch(searchForm) {
		const searchInput = searchForm.querySelector('.js-search-input');
		const searchDropdown = searchForm.querySelector('.js-search-dropdown');

		if (!searchInput || !searchDropdown) return;

		searchInput.addEventListener('input', function () {
			const query = searchInput.value.trim().toLowerCase();

			if (query.length < 1) {
				searchDropdown.classList.remove('is-open');
				searchDropdown.innerHTML = '';
				return;
			}

			const results = searchData.filter(function (item) {
				const title = item.title.toLowerCase();

				return title.startsWith(query) || title.includes(query);
			});

			renderSearchResults(searchDropdown, results);
		});

		searchForm.addEventListener('submit', function (event) {
			event.preventDefault();

			const firstResult = searchDropdown.querySelector('.header-search__item');

			if (firstResult) {
				firstResult.click();
			}
		});

		document.addEventListener('click', function (event) {
			if (!searchForm.contains(event.target)) {
				searchDropdown.classList.remove('is-open');
			}
		});
	}

	const searchForms = document.querySelectorAll('.js-search');

	searchForms.forEach(function (searchForm) {
		initSearch(searchForm);
	});

	// scroll header
	const header = document.querySelector('.header');

	if (header) {
		function toggleHeaderScrollClass() {
			if (window.scrollY > 10) {
				header.classList.add('is-scrolled');
			} else {
				header.classList.remove('is-scrolled');
			}
		}

		toggleHeaderScrollClass();

		window.addEventListener('scroll', toggleHeaderScrollClass);
	}

	// mobile menu
	function getDirectChildByClass(parent, className) {
		return Array.from(parent.children).find(function (child) {
			return child.classList.contains(className);
		});
	}

	function closeCatalogItem(item) {
		const trigger = getDirectChildByClass(item, 'js-catalog-trigger');
		const nestedOpenItems = item.querySelectorAll('.js-catalog-item.is-open');

		item.classList.remove('is-open');

		if (trigger) {
			trigger.setAttribute('aria-expanded', 'false');
		}

		nestedOpenItems.forEach(function (nestedItem) {
			nestedItem.classList.remove('is-open');

			const nestedTrigger = getDirectChildByClass(
				nestedItem,
				'js-catalog-trigger',
			);

			if (nestedTrigger) {
				nestedTrigger.setAttribute('aria-expanded', 'false');
			}
		});
	}

	function closeAllCatalogItems() {
		document
			.querySelectorAll('.js-catalog-item.is-open')
			.forEach(function (item) {
				closeCatalogItem(item);
			});
	}

	function openCatalogItem(item) {
		const trigger = getDirectChildByClass(item, 'js-catalog-trigger');

		item.classList.add('is-open');

		if (trigger) {
			trigger.setAttribute('aria-expanded', 'true');
		}
	}

	function initMobileCatalogMenu() {
		const triggers = document.querySelectorAll('.js-catalog-trigger');

		triggers.forEach(function (trigger) {
			trigger.addEventListener('click', function () {
				const currentItem = trigger.closest('.js-catalog-item');

				if (!currentItem) return;

				const isCurrentOpen = currentItem.classList.contains('is-open');
				const siblingItems = getCatalogSiblingItems(currentItem);

				siblingItems.forEach(function (item) {
					if (item !== currentItem) {
						closeCatalogItem(item);
					}
				});

				if (isCurrentOpen) {
					closeCatalogItem(currentItem);
				} else {
					openCatalogItem(currentItem);
				}
			});
		});
	}

	function getCatalogSiblingItems(currentItem) {
		const parentList = currentItem.parentElement;
		const columnsWrapper = parentList.closest('.mobile-menu-catalog__columns');

		if (columnsWrapper) {
			const columnLists = columnsWrapper.querySelectorAll(
				'.mobile-menu-catalog__sublist',
			);

			return Array.from(columnLists).flatMap(function (list) {
				return Array.from(list.children).filter(function (item) {
					return item.classList.contains('js-catalog-item');
				});
			});
		}

		return Array.from(parentList.children).filter(function (item) {
			return item.classList.contains('js-catalog-item');
		});
	}

	initMobileCatalogMenu();

	window.addEventListener('pageshow', function () {
		closeAllCatalogItems();
	});

	// cariusels
	function initGoodsCarousels() {
		const carousels = document.querySelectorAll('.js-goods-carousel');

		if (!carousels.length || typeof Splide === 'undefined') return;

		carousels.forEach(function (carousel) {
			const prevButton = carousel.querySelector('.js-goods-carousel-prev');
			const nextButton = carousel.querySelector('.js-goods-carousel-next');
			const paginationTrack = carousel.querySelector(
				'.js-goods-carousel-pagination',
			);

			const visibleDotsCount = 4;
			const dotSize = 10;
			const dotGap = 14;
			const dotStep = dotSize + dotGap;

			let firstVisibleDotIndex = 0;

			const splide = new Splide(carousel, {
				type: 'slide',
				perPage: 4,
				perMove: 1,
				gap: '24px',

				arrows: false,
				pagination: false,

				speed: 450,
				drag: true,
				rewind: false,

				// важно: чтобы можно было идти по индексам слайдов
				focus: 0,
				trimSpace: true,

				breakpoints: {
					1023: {
						perPage: 3,
					},
					767: {
						perPage: 2,
					},
					575: {
						perPage: 1,
					},
				},
			});

			function getSlidesCount() {
				return (
					splide.length || carousel.querySelectorAll('.splide__slide').length
				);
			}

			function getLastSlideIndex() {
				return Math.max(0, getSlidesCount() - 1);
			}

			function getMaxFirstVisibleDotIndex() {
				return Math.max(0, getSlidesCount() - visibleDotsCount);
			}

			function clampFirstVisibleDotIndex() {
				firstVisibleDotIndex = Math.max(
					0,
					Math.min(firstVisibleDotIndex, getMaxFirstVisibleDotIndex()),
				);
			}

			function syncDotsWindow() {
				const activeIndex = splide.index;
				const lastSlideIndex = getLastSlideIndex();

				const firstVisibleIndex = firstVisibleDotIndex;
				const lastVisibleIndex = firstVisibleDotIndex + visibleDotsCount - 1;

				if (activeIndex <= firstVisibleIndex && activeIndex > 0) {
					firstVisibleDotIndex = activeIndex - 1;
				}

				if (activeIndex >= lastVisibleIndex && activeIndex < lastSlideIndex) {
					firstVisibleDotIndex = activeIndex - visibleDotsCount + 2;
				}

				clampFirstVisibleDotIndex();
			}

			function renderDots() {
				if (!paginationTrack) return;

				const slidesCount = getSlidesCount();

				paginationTrack.innerHTML = '';

				for (let index = 0; index < slidesCount; index += 1) {
					const button = document.createElement('button');

					button.className = 'goods-carousel__pagination-button';
					button.type = 'button';
					button.setAttribute('aria-label', `Go to slide ${index + 1}`);

					button.addEventListener('click', function () {
						splide.go(index);
					});

					paginationTrack.appendChild(button);
				}
			}

			function updateDots() {
				if (!paginationTrack) return;

				const buttons = paginationTrack.querySelectorAll(
					'.goods-carousel__pagination-button',
				);

				buttons.forEach(function (button, index) {
					button.classList.toggle('is-active', index === splide.index);

					if (index === splide.index) {
						button.setAttribute('aria-current', 'true');
					} else {
						button.removeAttribute('aria-current');
					}
				});

				paginationTrack.style.transform =
					'translateX(' + firstVisibleDotIndex * -dotStep + 'px)';
			}

			function updateArrows() {
				const lastSlideIndex = getLastSlideIndex();

				if (prevButton) {
					prevButton.disabled = splide.index <= 0;
				}

				if (nextButton) {
					nextButton.disabled = splide.index >= lastSlideIndex;
				}
			}

			function updateControls() {
				syncDotsWindow();
				updateDots();
				updateArrows();
			}

			splide.on('mounted', function () {
				renderDots();
				updateControls();
			});

			splide.on('moved resized updated refresh', function () {
				updateControls();
			});

			splide.mount();

			if (prevButton) {
				prevButton.addEventListener('click', function () {
					splide.go('<');
				});
			}

			if (nextButton) {
				nextButton.addEventListener('click', function () {
					splide.go('>');
				});
			}
		});
	}

	initGoodsCarousels();

	// map
	// const maps = document.querySelectorAll('.where-buy__map');

	// maps.forEach(function (map) {
	// 	const popup = map.querySelector('.where-buy__popup');
	// 	const popupRegionName = map.querySelector('.where-buy__region-name');
	// 	const popupRegionStore = map.querySelector('.where-buy__region-store');
	// 	const mapLink = map.querySelector('.where-buy__link-map');
	// 	const regions = map.querySelectorAll('.region[data-region]');

	// 	if (!popup || !regions.length) return;

	// 	const baseUrl = 'gde-kupit?region_id=';
	// 	let activeRegion = null;

	// 	function getRegionUrl(region) {
	// 		return baseUrl + region.dataset.region;
	// 	}

	// 	function movePopup(event) {
	// 		const mapRect = map.getBoundingClientRect();
	// 		const popupRect = popup.getBoundingClientRect();

	// 		let x = event.clientX - mapRect.left + 13;
	// 		let y = event.clientY - mapRect.top + 13;

	// 		const maxX = mapRect.width - popupRect.width - 8;
	// 		const maxY = mapRect.height - popupRect.height - 8;

	// 		if (x > maxX) {
	// 			x = event.clientX - mapRect.left - popupRect.width - 13;
	// 		}

	// 		if (y > maxY) {
	// 			y = event.clientY - mapRect.top - popupRect.height - 13;
	// 		}

	// 		x = Math.max(8, x);
	// 		y = Math.max(8, y);

	// 		popup.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
	// 	}

	// 	function showPopup(region, event) {
	// 		const regionName = region.dataset.name || '';
	// 		const regionStore = region.dataset.store || '';

	// 		activeRegion = region;
	// 		region.classList.add('is-active');

	// 		if (popupRegionName) {
	// 			popupRegionName.textContent = regionName;
	// 		}

	// 		if (popupRegionStore) {
	// 			popupRegionStore.textContent = regionStore;
	// 			popupRegionStore.style.display = regionStore ? '' : 'none';
	// 		}

	// 		popup.setAttribute('href', getRegionUrl(region));
	// 		popup.classList.add('_show');

	// 		movePopup(event);
	// 	}

	// 	function hidePopup(region) {
	// 		if (region) {
	// 			region.classList.remove('is-active');
	// 		}

	// 		activeRegion = null;
	// 		popup.classList.remove('_show');
	// 		popup.style.transform = 'translate(-9999px, -9999px)';
	// 	}

	// 	regions.forEach(function (region) {
	// 		region.addEventListener('mouseenter', function (event) {
	// 			showPopup(region, event);
	// 		});

	// 		region.addEventListener('mousemove', function (event) {
	// 			if (activeRegion === region) {
	// 				movePopup(event);
	// 			}
	// 		});

	// 		region.addEventListener('mouseleave', function () {
	// 			hidePopup(region);
	// 		});

	// 		region.addEventListener('click', function (event) {
	// 			event.preventDefault();
	// 			window.location.href = getRegionUrl(region);
	// 		});
	// 	});

	// 	if (mapLink) {
	// 		mapLink.addEventListener('click', function (event) {
	// 			const region = event.target.closest('.region[data-region]');

	// 			event.preventDefault();

	// 			if (region) {
	// 				window.location.href = getRegionUrl(region);
	// 			}
	// 		});
	// 	}
	// });
	// initWhereBuyMap();

	// carousel wirh diferens blocks
	function initMediaCarousels() {
		const carousels = document.querySelectorAll('.js-media-carousel');

		console.log('media carousels found:', carousels.length);

		if (!carousels.length) return;

		if (typeof Splide === 'undefined') {
			console.error('Splide is not loaded');
			return;
		}

		carousels.forEach(function (carousel) {
			const prevButton = carousel.querySelector('.js-media-carousel-prev');
			const nextButton = carousel.querySelector('.js-media-carousel-next');
			const paginationTrack = carousel.querySelector(
				'.js-media-carousel-pagination',
			);

			try {
				const splide = new Splide(carousel, {
					type: 'slide',
					autoWidth: true,
					gap: 30,
					perMove: 1,
					pagination: false,
					arrows: false,
					drag: true,
					speed: 500,
					breakpoints: {
						767: {
							gap: 0,
						},
					},
				});

				function getVisibleDotsCount() {
					return 4;
				}

				function createPagination() {
					if (!paginationTrack) return;

					paginationTrack.innerHTML = '';

					const slidesCount =
						carousel.querySelectorAll('.splide__slide').length;

					for (let i = 0; i < slidesCount; i += 1) {
						const button = document.createElement('button');

						button.className = 'media-carousel__pagination-button';
						button.type = 'button';
						button.setAttribute('aria-label', `Go to slide ${i + 1}`);

						button.addEventListener('click', function () {
							splide.go(i);
						});

						paginationTrack.appendChild(button);
					}
				}

				function updatePagination() {
					if (!paginationTrack) return;

					const buttons = paginationTrack.querySelectorAll(
						'.media-carousel__pagination-button',
					);

					if (!buttons.length) return;

					const activeIndex = splide.index;
					const visibleDotsCount = getVisibleDotsCount();

					buttons.forEach(function (button, index) {
						button.classList.toggle('is-active', index === activeIndex);
					});

					let firstVisibleIndex =
						activeIndex - Math.floor(visibleDotsCount / 2);

					if (firstVisibleIndex < 0) {
						firstVisibleIndex = 0;
					}

					const maxFirstVisibleIndex = Math.max(
						0,
						buttons.length - visibleDotsCount,
					);

					if (firstVisibleIndex > maxFirstVisibleIndex) {
						firstVisibleIndex = maxFirstVisibleIndex;
					}

					const dotSize = 10;
					const dotGap = 14;
					const moveX = firstVisibleIndex * (dotSize + dotGap);

					paginationTrack.style.transform = `translateX(-${moveX}px)`;
				}

				function updateArrows() {
					if (!prevButton || !nextButton) return;

					const endIndex = splide.Components.Controller.getEnd();

					prevButton.disabled = splide.index === 0;
					nextButton.disabled = splide.index >= endIndex;
				}

				if (prevButton) {
					prevButton.addEventListener('click', function () {
						splide.go('<');
					});
				}

				if (nextButton) {
					nextButton.addEventListener('click', function () {
						splide.go('>');
					});
				}

				splide.on('mounted', function () {
					createPagination();
					updatePagination();
					updateArrows();

					console.log('media carousel mounted:', carousel);
				});

				splide.on('move moved resized updated', function () {
					updatePagination();
					updateArrows();
				});

				splide.mount();
			} catch (error) {
				console.error('Media carousel init error:', error);
			}
		});
	}

	initMediaCarousels();

	// Dealer modal
	function initDillerModal() {
		const section = document.querySelector('.diller-section');
		const openButton = document.querySelector('.js-diller-modal-open');
		const buttonText = document.querySelector('.js-diller-btn-text');
		const sectionStatus = document.querySelector('.js-diller-section-status');
		const modal = document.querySelector('.js-diller-modal');
		const overlay = document.querySelector('.mobile-menu-overlay');

		if (!section || !openButton || !modal || !overlay) return;

		const dialog = modal.querySelector('.diller-modal__dialog');
		const closeButton = modal.querySelector('.js-diller-modal-close');
		const form = modal.querySelector('.js-diller-modal-form');
		const errorElement = modal.querySelector('.js-diller-modal-error');

		if (!dialog || !closeButton || !form || !errorElement) return;

		const phone = form.querySelector('input[name="phone"]');
		const submitButton = form.querySelector('[type="submit"]');
		const focusableSelector =
			'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

		let returnFocusTo = openButton;
		let isSubmitting = false;

		function openModal() {
			if (section.classList.contains('is-request-sent')) return;

			closeMobileMenu();
			returnFocusTo = document.activeElement;

			modal.inert = false;
			modal.setAttribute('aria-hidden', 'false');
			modal.classList.add('is-open');
			document.body.classList.add('is-diller-modal-open');

			dialog.scrollTop = 0;

			const firstField = form.querySelector('select, input');

			if (firstField) {
				firstField.focus({ preventScroll: true });
			}
		}

		function closeModal() {
			if (!modal.classList.contains('is-open') || isSubmitting) return;

			modal.classList.remove('is-open');
			document.body.classList.remove('is-diller-modal-open');
			modal.setAttribute('aria-hidden', 'true');
			modal.inert = true;

			if (returnFocusTo && !returnFocusTo.disabled) {
				returnFocusTo.focus({ preventScroll: true });
			} else {
				section.focus({ preventScroll: true });
			}
		}

		function validatePhone() {
			if (!phone) return;

			phone.setCustomValidity('');

			const digits = phone.value.replace(/\D/g, '');

			if (phone.value.trim() && (digits.length < 8 || digits.length > 15)) {
				phone.setCustomValidity('Введите номер телефона: от 8 до 15 цифр');
			}
		}

		function setCompletedState(isDemo) {
			isSubmitting = false;
			closeModal();

			section.classList.add('is-request-sent');

			if (buttonText) {
				buttonText.textContent = isDemo
					? 'Заявка заполнена'
					: 'Запрос отправлен';
			}

			if (sectionStatus) {
				sectionStatus.textContent = isDemo
					? 'Демонстрационный режим: отправка на сервер пока не подключена.'
					: 'Спасибо! Ваша заявка отправлена.';
			}

			openButton.disabled = true;
			form.reset();
		}

		openButton.addEventListener('click', openModal);
		closeButton.addEventListener('click', closeModal);

		overlay.addEventListener('click', function () {
			if (document.body.classList.contains('is-diller-modal-open')) {
				closeModal();
			}
		});

		modal.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				event.preventDefault();
				closeModal();
				return;
			}

			if (event.key !== 'Tab') return;

			const elements = Array.from(
				dialog.querySelectorAll(focusableSelector),
			).filter(function (item) {
				return item.getClientRects().length > 0;
			});

			if (!elements.length) return;

			const first = elements[0];
			const last = elements[elements.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		});

		if (phone) {
			phone.addEventListener('input', validatePhone);
		}

		form.addEventListener('input', function () {
			errorElement.textContent = '';
		});

		form.addEventListener('submit', async function (event) {
			event.preventDefault();

			if (isSubmitting) return;

			validatePhone();

			if (!form.checkValidity()) {
				form.reportValidity();
				return;
			}

			if (form.dataset.demo === 'true') {
				setCompletedState(true);
				return;
			}

			const action = form.getAttribute('action');

			if (!action || action === '#') {
				errorElement.textContent = 'Не указан адрес обработки формы.';
				return;
			}

			isSubmitting = true;
			submitButton.disabled = true;
			submitButton.textContent = 'Отправляем...';

			try {
				const response = await fetch(action, {
					method: 'POST',
					body: new FormData(form),
					headers: {
						Accept: 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('HTTP ' + response.status);
				}

				setCompletedState(false);
			} catch (error) {
				isSubmitting = false;
				errorElement.textContent =
					'Не удалось отправить заявку. Попробуйте ещё раз.';
			} finally {
				submitButton.disabled = false;
				submitButton.textContent = 'Отправить заявку';
			}
		});

		window.addEventListener('pageshow', function () {
			if (modal.classList.contains('is-open')) {
				isSubmitting = false;
				closeModal();
			}
		});
	}

	initDillerModal();

	// Общая корзина
	function initCart() {
		const cart = document.querySelector('.js-cart');
		const cartToggle = document.querySelector('.js-cart-toggle');
		const overlay = document.querySelector('.mobile-menu-overlay');

		if (!cart || !cartToggle || !overlay) return;

		const closeButton = cart.querySelector('.js-cart-close');
		const clearButton = cart.querySelector('.js-cart-clear');
		const itemsList = cart.querySelector('.js-cart-items');
		const emptyMessage = cart.querySelector('.js-cart-empty');
		const totalElement = cart.querySelector('.js-cart-total');
		const countElement = cartToggle.querySelector('.js-cart-count');
		const checkoutLink = cart.querySelector('.js-cart-checkout');
		const storageKey = 'villartec-cart-v1';
		const formatPrice = price =>
			new Intl.NumberFormat('ru-RU').format(price) + ' руб.';
		let previousFocus = cartToggle;
		let items = [];

		function saveCart() {
			try {
				localStorage.setItem(storageKey, JSON.stringify(items));
			} catch (error) {
				// Корзина работает и при отключённом localStorage.
			}
		}

		function loadCart() {
			try {
				const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
				if (!Array.isArray(data)) return;

				items = data
					.filter(function (item) {
						return (
							item &&
							typeof item.id === 'string' &&
							typeof item.name === 'string' &&
							Number.isFinite(item.price) &&
							item.price >= 0 &&
							Number.isInteger(item.quantity) &&
							item.quantity > 0
						);
					})
					.map(function (item) {
						return { ...item, quantity: Math.min(99, item.quantity) };
					});
			} catch (error) {
				items = [];
			}
		}

		function createItem(item) {
			const li = document.createElement('li');
			li.className = 'cart__item';

			const info = document.createElement('div');
			const name = document.createElement('p');
			name.className = 'cart__item-name';
			name.textContent = item.name;
			const price = document.createElement('p');
			price.className = 'cart__item-price';
			price.textContent = formatPrice(item.price);
			info.append(name, price);

			const controls = document.createElement('div');
			controls.className = 'cart__item-controls';

			function makeButton(action, label, content) {
				const button = document.createElement('button');
				button.type = 'button';
				button.className = 'cart__item-button';
				button.dataset.action = action;
				button.dataset.id = item.id;
				button.setAttribute('aria-label', label);
				button.textContent = content;
				return button;
			}

			const remove = makeButton('remove', 'Удалить ' + item.name, '');
			remove.classList.add('cart__item-remove');
			const trashIcon = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'svg',
			);
			trashIcon.setAttribute('viewBox', '0 0 24 24');
			trashIcon.setAttribute('aria-hidden', 'true');
			const trashPath = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'path',
			);
			trashPath.setAttribute(
				'd',
				'M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7',
			);
			trashIcon.appendChild(trashPath);
			remove.appendChild(trashIcon);
			const minus = makeButton(
				'minus',
				'Уменьшить количество ' + item.name,
				'−',
			);
			minus.disabled = item.quantity === 1;
			const quantity = document.createElement('span');
			quantity.className = 'cart__item-count';
			quantity.textContent = item.quantity + ' шт.';
			const plus = makeButton('plus', 'Увеличить количество ' + item.name, '+');
			plus.disabled = item.quantity >= 99;
			controls.append(remove, minus, quantity, plus);
			li.append(info, controls);
			return li;
		}

		function renderCart() {
			itemsList.replaceChildren(...items.map(createItem));
			const count = items.reduce((sum, item) => sum + item.quantity, 0);
			const total = items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0,
			);
			countElement.hidden = count === 0;
			countElement.textContent = count > 99 ? '99+' : String(count);
			cartToggle.setAttribute('aria-label', 'Корзина: ' + count + ' товаров');
			emptyMessage.hidden = items.length > 0;
			clearButton.hidden = items.length === 0;
			totalElement.textContent = formatPrice(total);
			checkoutLink.setAttribute(
				'aria-disabled',
				items.length ? 'false' : 'true',
			);
			checkoutLink.tabIndex = items.length ? 0 : -1;
		}

		function addItem({ id, name, price, quantity = 1 }) {
			id = String(id || '').trim();
			name = String(name || '').trim();
			price = Number(price);
			quantity = Number(quantity);

			if (
				!id ||
				!name ||
				!Number.isFinite(price) ||
				price < 0 ||
				!Number.isInteger(quantity) ||
				quantity <= 0
			)
				return false;

			const existing = items.find(item => item.id === id);
			if (existing) {
				existing.quantity = Math.min(99, existing.quantity + quantity);
			} else {
				items.push({ id, name, price, quantity: Math.min(99, quantity) });
			}
			saveCart();
			renderCart();
			return true;
		}

		function changeQuantity(id, delta) {
			const item = items.find(product => product.id === id);
			if (!item) return;
			item.quantity = Math.max(1, Math.min(99, item.quantity + delta));
			saveCart();
			renderCart();
		}

		function removeItem(id) {
			items = items.filter(item => item.id !== id);
			saveCart();
			renderCart();
		}

		function clearCart() {
			items = [];
			saveCart();
			renderCart();
		}

		function openCart() {
			if (document.body.classList.contains('is-diller-modal-open')) return;
			closeMobileMenu();
			previousFocus = document.activeElement;
			cart.inert = false;
			cart.setAttribute('aria-hidden', 'false');
			cart.classList.add('is-open');
			cartToggle.setAttribute('aria-expanded', 'true');
			document.body.classList.add('is-cart-open');
			closeButton.focus({ preventScroll: true });
		}

		function closeCart() {
			if (!cart.classList.contains('is-open')) return;
			cart.classList.remove('is-open');
			cartToggle.setAttribute('aria-expanded', 'false');
			cart.inert = true;
			cart.setAttribute('aria-hidden', 'true');
			document.body.classList.remove('is-cart-open');
			if (previousFocus && typeof previousFocus.focus === 'function') {
				previousFocus.focus({ preventScroll: true });
			}
		}

		cartToggle.addEventListener('click', openCart);
		closeButton.addEventListener('click', closeCart);
		clearButton.addEventListener('click', clearCart);

		overlay.addEventListener('click', function () {
			if (document.body.classList.contains('is-cart-open')) closeCart();
		});

		itemsList.addEventListener('click', function (event) {
			const button = event.target.closest('button[data-action]');
			if (!button) return;
			const { action, id } = button.dataset;
			if (action === 'plus') changeQuantity(id, 1);
			if (action === 'minus') changeQuantity(id, -1);
			if (action === 'remove') removeItem(id);
		});

		document.addEventListener('click', function (event) {
			const addButton = event.target.closest('[data-cart-add]');
			if (!addButton) return;
			event.preventDefault();
			const success = addItem({
				id: addButton.dataset.cartId,
				name: addButton.dataset.cartName,
				price: addButton.dataset.cartPrice,
			});
			if (success && addButton.dataset.cartOpen !== 'false') openCart();
		});

		cart.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				event.preventDefault();
				closeCart();
				return;
			}

			if (event.key !== 'Tab') return;
			const focusables = Array.from(
				cart.querySelectorAll(
					'a[href]:not([aria-disabled="true"]), button:not(:disabled), [tabindex]:not([tabindex="-1"])',
				),
			).filter(element => element.getClientRects().length > 0);
			if (!focusables.length) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		});

		checkoutLink.addEventListener('click', function (event) {
			if (!items.length) {
				event.preventDefault();
				return;
			}
			closeCart();
		});

		window.addEventListener('pageshow', closeCart);
		window.addEventListener('storage', function (event) {
			if (event.key === storageKey) {
				loadCart();
				renderCart();
			}
		});

		// Можно вызывать со страниц товаров: VillartecCart.add({ id, name, price }).
		window.VillartecCart = {
			add: addItem,
			open: openCart,
			close: closeCart,
			clear: clearCart,
			getItems: () => items.map(item => ({ ...item })),
		};

		loadCart();
		renderCart();
	}

	initCart();
});
