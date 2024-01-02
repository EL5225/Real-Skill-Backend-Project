const multer = require("multer");
const generateFilterImage = (props) => {
  const { mimetypes } = props;
  return multer({
    fileFilter: (req, file, cb) => {
      const allowedMimetypes = mimetypes;
      if (!allowedMimetypes.includes(file.mimetype)) {
        const err = new Error(
          `Invalid mimetype ${file.mimetype}, only ${allowedMimetypes} are allowed`,
        );
        return cb(err, false);
      }
      cb(null, true);
    },
  });
};

const imageUpload = generateFilterImage({
  mimetypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
});

module.exports = {
  imageUpload,
};
