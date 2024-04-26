const { series } = require('gulp');
const cp = require('child_process');
const { rimraf } = require('rimraf');

const clean = async () => {
  try {
    const deleted = await rimraf(['logs', 'build']);
    if (deleted) {
      console.info('Cleaned build/ and dist/');
      return true;
    } else {
      console.log('Not Cleaned');
    }
  } catch (error) {
    console.error(error);
  }
};

const buildServer = () => cp.exec('echo "hello"');

const buildClient = (cb) => {
  sh.shell.chdir('/views');
  sh.shell.task('npm run build');
  cb();
};

const copyStatic = (cb) => {
  sh.shell.cp('/views/dist', '/public');
  cb();
};

exports.build = series(clean, buildServer, buildClient, copyStatic);
