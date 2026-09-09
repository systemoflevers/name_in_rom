import { romFile } from "./rom_file.js";

/**
 * ROM address where the string strarts. Obtained from the map file generated
 * by GBDK
 */
const kStringStart = 0x21B;
const kGlobalChecksumLocation = 0x014e;

function base64ToUint8Array(b64String) {
    // fromBase64 is new-ish so check
    if (Uint8Array.fromBase64) { 
        return Uint8Array.fromBase64(b64String);
    }
    const stringEncodedBinary = window.atob(b64String);
    const bytes = new Uint8Array(stringEncodedBinary.length);
    for (let i = 0; i < bytes.length; ++i) {
        bytes[i] = stringEncodedBinary.charCodeAt(i);
    }
    return bytes;
}

/**
 * 
 * @param {Uint8Array} romData 
 * @returns {Uint8Array}
 */
function updateGlobalChecksum(romData) {
  romData[kGlobalChecksumLocation] = 0;
  romData[kGlobalChecksumLocation + 1] = 0;
  const sum = romData.reduce((sum, v) => (v + sum) % (1<<16));
  const sum16 = new Uint16Array([sum]);
  const sum8 = new Uint8Array(sum16.buffer);

  console.log(sum, sum16, sum8);
  romData[kGlobalChecksumLocation] = sum8[1];
  romData[kGlobalChecksumLocation + 1] = sum8[0];

  return romData;
}

/**
 * Put the given name into the given ROM at the given location.
 * @param {string} nameString Name to add to ROM. Assumed to be small enough to fit.
 * @param {Uint8Array} baseROM 
 * @param {number} editLocation Name value's location in the ROM.
 * @returns {Uint8Array} ROM data with the name added.
 */
function putNameInROM(nameString, baseROM, editLocation) {
  const nameBytes = new Uint8Array([...[...nameString].map(c => c.charCodeAt(0)), 0]);

  const customROM = new Uint8Array(baseROM);
  customROM.set(nameBytes, editLocation);
  return updateGlobalChecksum(customROM);
}

/**
 * Cause the given romData to be downloaded with the given file name.
 * @param {Uint8Array} romData 
 * @param {string} fileName 
 */
function downloadROM(romData, fileName) {
  const a = document.createElement('a');
  a.download = fileName;
  const dataUrl = URL.createObjectURL(new Blob([romData], {type: "octet/stream"}));
  a.href = dataUrl;
  a.click();
  setTimeout(() => URL.revokeObjectURL(dataUrl));
}

function main() {
  const baseROM = base64ToUint8Array(romFile);

  /** @type {HTMLInputElement} */
  const nameInput = document.getElementById('name-input');

  /** @type {HTMLButtonElement} */
  const button = document.getElementById('download-button');
  button.addEventListener('click', () => {
    let nameString = nameInput.value;

    // left pad with spaces to center the name
    if (nameString.length > 20) {
      alert('your name is too long, 20 characters max');
      return;
    }
    const nameLength = nameString.length;
    const spacesToAdd = Math.floor((20 - nameLength) / 2);
    nameString = ' '.repeat(spacesToAdd) + nameString;

    const customROM = putNameInROM(nameString, baseROM, kStringStart);

    downloadROM(customROM, 'cool_custom_rom.gb');
  });
}

main();