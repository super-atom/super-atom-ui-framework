const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');
StyleDictionary.registerParser({
  pattern: /\.json$/,
  parse: ({ filePath, contents }) => {
    const parsed = JSON.parse(contents);
    const newObj = {};

    // Loop over all tokensets
    Object.values(parsed).forEach((val) => {
      // Grab all entries and put them at the top of new object
      Object.entries(val).forEach(([key, innerVal]) => {
        newObj[key] = innerVal;
      })
    })

    return newObj;
  }
});
registerTransforms(StyleDictionary);

const sd = StyleDictionary.extend({
  source: ['src/tokens/input/tokens_button_0317.json'],
  platforms: {
    js: {
      transformGroup: 'tokens-studio',
      buildPath: 'dist/tokens/',
      files: [
        {
          destination: 'variables.js',
          format: 'javascript/es6',
        },
      ],
    },
    scss: {
      transforms: [
        'ts/descriptionToComment',
        'ts/resolveMath',
        'ts/size/px',
        'ts/size/letterspacing',
        'ts/size/lineheight',
        'ts/type/fontWeight',
        'ts/color/hexrgba',
        'ts/color/modifiers',
        'ts/typography/css/shorthand',
        'ts/shadow/shorthand',
        'name/cti/kebab',
      ],
      buildPath: 'src/tokens/output/',
      files: [
        {
          destination: 'variables.scss',
          format: 'scss/variables',
        },
      ],
    },
  },
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();
