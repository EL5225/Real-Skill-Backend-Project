const { VSEditVideo } = require("../libs/validation/video");
const { editVideoService, deleteVideoService } = require("../services/video");
const { queryVideoById } = require("../utils/helpers/video");

const editVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body, time, is_watched } = req.body;
    VSEditVideo.parse(req.body);

    const existingVideo = await queryVideoById(id);

    if (!existingVideo) {
      return res.status(404).json({
        status: false,
        message: "Video tidak ditemukan",
      });
    }

    const video = await editVideoService(id, title, body, time, is_watched);

    return res.status(200).json({
      status: true,
      message: "Video diperbarui",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingVideo = await queryVideoById(id);

    if (!existingVideo) {
      return res.status(404).json({
        status: false,
        message: "Video tidak ditemukan",
      });
    }

    const video = await deleteVideoService(id);

    return res.status(200).json({
      status: true,
      message: "Video berhasil dihapus",
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  editVideo,
  deleteVideo,
};
