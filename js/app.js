/** Class Representing an image */
class appImage {
	/**
	 * Create an image class
	 * @param {string} url
	 * @param {string} author
	 * @param {string} id
	 */
	constructor(url, author, id) {
		this.url = url;
		this.author = author;
		this.id = id;
		let img = new Image();
		img.src = this.url;
		this.img = img;
	}
}

/** Class Representing the Image list */
class ImageList {
	/**
	 * Create an image class.
	 * @param {number} number - The page number.
	 * @callback ready - A function to return once fully setup.
	 */
	constructor(number = 1, ready = () => {}) {
		this.pageNumber = number;
		this.listURL = 'https://picsum.photos/v2/list?page=' + number;
		this.images = [];
		this.currentImage = 0;
		this.createImages(ready);
	}

	/**
	 * Get the next image in the list.
	 */
	get nextImage() {
		this.currentImage++;
		return this.images[this.currentImage - 1];
	}

	/**
	 * Generates the list of images.
	 * @callback ready - A function to return once fully setup.
	 */
	createImages(ready) {
		$.get(this.listURL, (dataa) => {
			for (let i = 0; i < dataa.length; i++) {
				let data = dataa[i];
				let image = new appImage(
					data.download_url,
					data.author,
					data.id
				);
				this.images.push(image);
			}
			ready();
		});
	}
}

/**
 * Class for the email containers
 */
class emailContainer {
	/**
	 * Contructor for the email Container
	 * @param {string} email - Email assigned to the container
	 * @param {number} id - Unique ID of the container
	 */
	constructor(email, id) {
		this.email = email;
		this.imgList = [];
		$('.EmailBuckets').append(`<div id='emailBox-${id}'>
			<div class="header">
				<h3>${email}</h3>
				<div class="icons" id="icons">
					<span class="fas fa-chevron-down"></span>
					<span class="fas fa-chevron-up hide"></span>
				</div>
			</div>
			<div class="imageHolderHolder imgHHTrans"></div>
		</div><hr />`);
		this.div = $(`#emailBox-${id}`);
		this.imageHolder = $(`#emailBox-${id} .imageHolderHolder`);
	}

	/**
	 * addImage - adds an image to the email container
	 * @param {object} imgObj - an appImage object that is to be added to the container
	 */
	addImage(imgObj) {
		this.imgList.push(imgObj);
		this.imageHolder.append(`<div class="ImageHolder">
			<img src="${imgObj.url}" alt="" id="imageToChoose" />
		</div>`);
	}
}

let currentImage;
let emailCounter = 0;
let currentEmails = {};

/**
 * Gets the next image and sets the images src on the main page
 */
const nextImage = () => {
	let list = imgLists[imgLists.length - 1];
	let img = list.nextImage;
	if (list && img) {
		console.log('a');
		$('#imageToChoose').attr('src', img.url + '.jpg');
		currentImage = img;
	} else {
		console.log('b');
		let newList = new ImageList(imgLists.length + 1, () => {
			imgLists.push(newList);
			img = newList.nextImage;
			$('#imageToChoose').attr('src', img.url + '.jpg');
			currentImage = img;
		});
	}
};

/**
 * validates an email provided https://www.w3resource.com/javascript/form/email-validation.php
 * @param {string} email - email to validate
 * @returns {bool} - wether it is an email or not
 */
const validateEmail = (email) => {
	{
		if (
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
				email
			)
		) {
			return true;
		}
		alert('You have entered an invalid email address!');
		return false;
	}
};

/**
 * Used to when the assign button is clicked.
 */
const assignCurrentImg = () => {
	let email = $('#emailInput').val();
	if (!validateEmail(email)) {
		return;
	}

	$('#nothingHere').remove();

	if (currentEmails[email]) {
		currentEmails[email].addImage(currentImage);
	} else {
		currentEmails[email] = new emailContainer(email, emailCounter);
		currentEmails[email].addImage(currentImage);
		emailCounter++;
	}

	nextImage();
};

let imgLists = [new ImageList(1, nextImage)];

$('#newImage').click(() => {
	nextImage();
});

$('#assign').click(() => {
	assignCurrentImg();
});

$('.EmailBuckets').on('click', '.icons', (e) => {
	let el = $(e.currentTarget.parentNode.parentNode);
	let child = el.children('.imageHolderHolder');

	el.toggleClass('expanded');
	if (el.hasClass('expanded')) {
		child.css('height', 'auto'); // Set height to auto so we can grab the height
		let h = child.height(); // Get auto height
		child.css('height', 0); // Set back to 0 for the transition
		setTimeout(() => {
			// Timeout cos css is weird
			child.css('height', h); // set height

			setTimeout(() => {
				child.css('height', 'auto'); // set back to auto so if new lines are added it will still expand
			}, 500);
		}, 100);
	} else {
		let h = child.height();
		child.css('height', h);
		setTimeout(() => {
			child.css('height', 0);
		}, 100);
	}
});

// let list1 = new ImageList(1,() => {
//     console.log(list1.nextImage.url)
//     $("body").append('<img src="'+ list1.nextImage.url +'" alt="">')
// })
//console.log(list1.images)
