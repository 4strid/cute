
export class Sound {
	constructor(src, loop = false) {
		this.sound = document.createElement("audio");
	    this.sound.src = src;
	    this.sound.setAttribute("preload", "auto");
	    this.sound.setAttribute("controls", "none");
	    this.sound.style.display = "none";
	    document.body.appendChild(this.sound);
	    this.sound.loop = loop;
	}
 
	play() {
		this.sound.play();
	}

	stop() {
		this.sound.pause();
	}
} 

export const trashSound = new Sound('https://www.partnersinrhyme.com/files/sounds1/MP3/household/Trash_Can.mp3');

export const fireSound = new Sound('https://www.partnersinrhyme.com/files/sounds1/MP3/ambience/fire/forest_fire.mp3', true);

export const meowSound = new Sound('./audio/meow.mp3');

// backup meow
// export const meowSound = new Sound('http://soundbible.com/mp3/Cat Meow-SoundBible.com-1453940411.mp3');

// credit  Kitty In The Window by Podington Bear 
export const music = new Sound('./audio/song.mp3', true);