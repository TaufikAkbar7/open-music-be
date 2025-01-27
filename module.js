const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2);

/**
 * Generate template module
 */
if (args.length === 0) {
  console.log('Please provide a module name.');
} else {
  const moduleName = args[0];
  const apiPath = path.join('src', 'api', moduleName);
  const servicePath = path.join('src', 'services', moduleName)
  const validationPath = path.join('src', 'validator', moduleName)

  try {
    fs.mkdirSync(apiPath, { recursive: true });
    const listFolderNames = ['handler', 'index', 'routes'];

    // Create seperates folders and files
    listFolderNames.forEach(folderName => {
      fs.closeSync(fs.openSync(path.join(apiPath, `${folderName}.js`), 'w'));
    });

    // Create seperates folders and files
    fs.mkdirSync(path.join(servicePath));
    fs.closeSync(fs.openSync(path.join(servicePath, `index.js`), 'w'));

    fs.mkdirSync(validationPath, { recursive: true });
    const listFolderValidatorNames = ['index', 'schema'];

    // Create seperates folders and files
    listFolderValidatorNames.forEach(folderName => {
      fs.closeSync(fs.openSync(path.join(validationPath, `${folderName}.js`), 'w'));
    });

    console.log(`Module "${moduleName}" directory structure created successfully. Let's check it out!`);
  } catch (err) {
    console.error(`Error creating module "${moduleName}": ${err}`);
  }
}