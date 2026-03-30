<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  http_response_code(405);
  echo 'Method Not Allowed';
  exit;
}

// Recipient: replace with your real email address
$receiving_email_address = 'sfngom@ept.sn';

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

$errors = [];
if ($name === '') $errors[] = 'Name is required.';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid email is required.';
if ($subject === '') $errors[] = 'Subject is required.';
if ($message === '') $errors[] = 'Message is required.';
if (strlen($message) > 5000) $errors[] = 'Message is too long.';

if ($errors) {
  http_response_code(400);
  echo implode("\n", $errors);
  exit;
}

// Prevent header injection
$subjectSafe = preg_replace("/[\r\n]+/", ' ', $subject) ?? '';

$body = "From: {$name}\n";
$body .= "Email: {$email}\n\n";
$body .= $message . "\n";

$headers = [
  "From: {$name} <{$email}>",
  "Reply-To: {$email}",
  'Content-Type: text/plain; charset=UTF-8',
  'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = @mail(
  $receiving_email_address,
  $subjectSafe,
  $body,
  implode("\r\n", $headers)
);

if ($sent) {
  echo 'OK';
  exit;
}

// Local/dev fallback: if mail() isn't configured, store the message on disk.
$submissionsDir = __DIR__ . DIRECTORY_SEPARATOR . '_submissions';
if (!is_dir($submissionsDir)) {
  @mkdir($submissionsDir, 0755, true);
}

if (is_dir($submissionsDir) && is_writable($submissionsDir)) {
  $timestamp = gmdate('Ymd_His');
  $random = bin2hex(random_bytes(8));
  $filePath = $submissionsDir . DIRECTORY_SEPARATOR . "{$timestamp}_{$random}.txt";

  $content = "To: {$receiving_email_address}\n";
  $content .= "Subject: {$subjectSafe}\n";
  $content .= $body;

  if (@file_put_contents($filePath, $content) !== false) {
    echo 'OK';
    exit;
  }
}

http_response_code(500);
echo "Mail sending failed. If you're developing locally on Windows, PHP mail() is often not configured.\n";
echo 'Tip: configure SMTP on your host, or use a form backend service.';
