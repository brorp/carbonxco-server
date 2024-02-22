class VersionController {
    static status = async (req, res, next) => {
      try {
        res.status(200).json({
          status: "active",
          version: "v1",
        });
      } catch (error) {
        next(error);
      }
    };
  }

module.exports = VersionController