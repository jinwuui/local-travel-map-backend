const logger = (req, res, next) => {
  const start = Date.now();
  console.log(`REQ: ${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`    - ${res.statusCode} ${res.statusMessage}`);
    console.log(`    - ${duration} ms`);
  });

  next(); // 다음 미들웨어 또는 라우트 핸들러로 제어를 전달
};

module.exports = logger;
