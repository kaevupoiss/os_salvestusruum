<template>
  <div class="home">
    <div class="form">
      <p>
        Vali või sisesta kuni kümneelemendiline järjend kujul
        "A,2;B,3;A,-;C,4;B,+3;D,5;E,15;C,-;F,5"
      </p>
      <div class="wrapper">
        <div class="inputs">
          <label>
            <input
              type="radio"
              name="Esimene"
              id="esimene"
              :value="defaultArrays[0]"
              v-model="formData.selectedArray"
            />Esimene
          </label>
          <span>{{ parseArrayToString(defaultArrays[0]) }}</span>
          <label>
            <input
              type="radio"
              name="Teine"
              id="teine"
              :value="defaultArrays[1]"
              v-model="formData.selectedArray"
            />Teine
          </label>
          <span>{{ parseArrayToString(defaultArrays[1]) }}</span>
          <label>
            <input
              type="radio"
              name="Kolmas"
              id="kolmas"
              :value="defaultArrays[2]"
              v-model="formData.selectedArray"
            />Kolmas
          </label>
          <span>{{ parseArrayToString(defaultArrays[2]) }}</span>
          <label>
            <input
              type="radio"
              name="Enda"
              id="enda"
              :value="parsedCustomArray"
              v-model="formData.selectedArray"
            />Enda oma
          </label>
          <input
            type="text"
            placeholder="sisesta järjend"
            v-model="formData.customArray"
          />
        </div>
        <div class="fragmentation">
          <span>Allesjäänud failidest on fragmenteerunud:</span>
          <h3>{{ fragmented.files }}%</h3>
          <span>Fragmenteerunud failidele kuulub kasutatud ruumist:</span>
          <h3>{{ fragmented.space }}%</h3>
        </div>
      </div>
      <p>{{ parsedCustomArray }}</p>
      <p>Algoritmi käivitamiseks klõpsa nupule</p>
      <div class="buttons">
        <button @click="start()">Käivita</button>
        <button @click="clearGraph()">Puhasta väljund</button>
      </div>
    </div>
    <Graph :inputArray="inputArray" :processes="processes" />
  </div>
</template>

<script>
import Graph from "@/components/Graph.vue";
import { algorithmFunction } from "@/js/algorithmFunction.js";

export default {
  name: "Home",
  components: { Graph },
  data: function () {
    return {
      defaultArrays: [
        [
          ["A", 2, null],
          ["B", 3, null],
          ["A", null, "-"],
          ["C", 4, null],
          ["B", 3, "+"],
          ["D", 5, null],
          ["E", 15, null],
          ["C", null, "-"],
          ["F", 5, null],
        ],
        [
          ["A", 4, null],
          ["B", 3, null],
          ["C", 6, null],
          ["D", 5, null],
          ["C", 2, "+"],
          ["B", null, "-"],
          ["E", 5, null],
          ["A", null, "-"],
          ["F", 10, null],
        ],
        [
          ["A", 2, null],
          ["B", 3, null],
          ["C", 4, null],
          ["D", 5, null],
          ["B", null, "-"],
          ["E", 7, null],
          ["D", null, "-"],
          ["E", 3, "+"],
          ["F", 10, null],
        ],
      ],
      formData: {
        selectedArray: null,
        customArray: "",
      },
      inputArray: null,
      alphabet: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      processes: [],
      spaceFragmented: 35.48,
    };
  },
  methods: {
    parseArrayToString: function (array) {
      let parsedString = "";

      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (index == array.length - 1) {
          parsedString +=
            element[0] +
            "," +
            (element[2] ? element[2] : "") +
            (element[1] ? element[1] : "");
        } else {
          parsedString +=
            element[0] +
            "," +
            (element[2] ? element[2] : "") +
            (element[1] ? element[1] : "") +
            ";";
        }
      }

      return parsedString;
    },
    start: function () {
      console.log("Algorithm initiated.");
      this.processes = this.formData.selectedArray;
      this.inputArray = algorithmFunction(this.formData.selectedArray);
    },
    clearGraph: function () {
      this.inputArray = null;
    },
  },
  computed: {
    fragmented: function () {
      if (this.inputArray == null) return { files: 0.0, space: 0.0 };

      let nameCounts = {};
      this.inputArray[this.inputArray.length - 1].forEach((el) => {
        let fileName = el[0];

        if (!nameCounts[fileName]) nameCounts[fileName] = 0;
        nameCounts[fileName] += 1;
      });

      let fragmentedCount = 0;
      for (const fileName in nameCounts) {
        if (nameCounts[fileName] > 1) fragmentedCount += 1;
      }

      let filesFragmentedPercent = (
        (fragmentedCount / Object.keys(nameCounts).length) *
        100
      ).toFixed(2);

      let spaceFragmented = 0;
      let spaceUnFragmented = 0;

      this.inputArray[this.inputArray.length - 1].forEach((el) => {
        if (nameCounts[el[0]] > 1) spaceFragmented += el[2] - el[1];
        else spaceUnFragmented += el[2] - el[1];
      });

      let spaceFragmentedPercent = (
        (spaceFragmented / (spaceFragmented + spaceUnFragmented)) *
        100
      ).toFixed(2);

      return {
        files: filesFragmentedPercent,
        space: spaceFragmentedPercent,
      };
    },
    parsedCustomArray: function () {
      let re = /^([A-Z]?,[-+]?\d*;?)+$/g;

      if (
        re.test(this.formData.customArray) &&
        !this.formData.customArray.endsWith(";")
      ) {
        let array = this.formData.customArray.split(";");
        array = array.map((element) => {
          let el = element.split(",");

          if (el[1].charAt(0) == "+" || el[1].charAt(0) == "-") {
            el.push(el[1].charAt(0));
            el[1] = el[1].substring(1);
          } else {
            el.push(null);
          }

          if (el[1] == "") {
            el[1] = null;
          } else {
            el[1] = parseInt(el[1]);
          }

          return el;
        });

        if (array.length > 10) return "Array is too long";
        return array;
      }

      return "Input doesn't match the pattern";
    },
  },
};
</script>

<style lang="scss">
.form {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  padding: 2rem;
  box-shadow: 0 0 10px 0 rgba($color: $grey500, $alpha: 0.5);
}

.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
}

.fragmentation {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.inputs {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.25rem;

  label {
    display: flex;
    column-gap: 0.25rem;
    align-items: center;
  }

  input[type="text"] {
    padding: 0.25rem;
    font-size: 0.875rem;
    border: 1px solid $grey500;
  }

  span {
    background-color: $grey200;
    padding: 0.25rem;
    font-size: 0.875rem;
    border: 1px solid $grey400;
  }
}

.buttons {
  display: flex;
  column-gap: 0.5rem;
}

button {
  padding: 0.25rem;
  border: 1px solid $grey500;
}
</style>
