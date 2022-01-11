// const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
import _cloneDeep from "lodash/cloneDeep";

export function algorithmFunction(inputArray) {
  let returnArray = [];

  //* [[startX, endX (exclusive)], ...]
  let freeSpace = [[0, 48]];

  for (let i = 0; i < inputArray.length; i++) {
    let etappArray = i == 0 ? [] : _cloneDeep(returnArray[i - 1]);
    const currentElement = inputArray[i];

    if (currentElement[2] == null || currentElement[2] === "+") {
      // Add element blocks
      let spaceNeeded = currentElement[1];

      while (spaceNeeded > 0) {
        // If there's no free space left add error row and exit the function;
        if (freeSpace.length == 0) {
          etappArray = [[null, 0, 48]];
          break;
        }

        let slot = freeSpace.shift();

        // If slot is larger than space needed
        if (slot[1] - slot[0] > spaceNeeded) {
          // Push added to the etapp array
          etappArray.push([currentElement[0], slot[0], slot[0] + spaceNeeded]);

          // Push the new smaller slot to the free space array
          slot[0] += spaceNeeded;
          freeSpace.push(slot);

          // End the search for available space
          break;
        } else {
          // Push added slot to the etapp array
          etappArray.push([currentElement[0], slot[0], slot[1]]);

          // Decrement the space needed by the used slot size
          spaceNeeded -= slot[1] - slot[0];
        }
      }
    } else if (currentElement[2] === "-") {
      // Add spaces-to-be-freed to free space array
      etappArray.forEach((item) => {
        if (item[0] === currentElement[0]) {
          freeSpace.push([item[1], item[2]]);
        }
      });

      // Remove elements from etapp array
      etappArray = etappArray.filter((item) => item[0] != currentElement[0]);
    }

    // Sorteeri vabade lõikude massiiv
    freeSpace.sort(function (a, b) {
      return a[0] - b[0];
    });

    etappArray.sort(function (a, b) {
      return a[1] - b[1];
    });

    returnArray.push(etappArray);

    if (etappArray[0][0] == null) break;
  }

  return returnArray;
}
