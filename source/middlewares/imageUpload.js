import multer from 'multer';

const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/');
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilters = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(new Error('Wrong file mimetype'), false);
  }
};

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 1024 * 1024 * 4,
  },
  fileFilter: fileFilters,
});

export const imageUpload = upload.single('productImage');
