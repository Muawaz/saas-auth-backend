const emailOpens = [];
async function isopen(req, res) {
  const emailId = req.query.emailId;
  if (emailId) {
    // Log the email open event
    emailOpens.push({ emailId, timestamp: new Date() });
    console.log(`Email opened: ${emailId} at ${new Date()}`);
  }

  // Respond with a transparent 1x1 pixel image
  res.setHeader("Content-Type", "image/png");
  res.send(
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PVEEfAAAAABJRU5ErkJggg==",
      "base64"
    )
  );
}

module.exports = {
  isopen,
};
