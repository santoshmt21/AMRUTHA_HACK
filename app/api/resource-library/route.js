import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { verifyToken } from '@/app/lib/auth.js';
import connectDB from '@/app/lib/mongoose.js';
import ResourceLibrary from '@/app/models/ResourceLibrary.js';

const DRIVE_SCOPE = ['https://www.googleapis.com/auth/drive.file'];

function getEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

async function getDriveAuthClient() {
  const serviceAccountRaw = getEnv('GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON');

  if (serviceAccountRaw) {
    const credentials = JSON.parse(serviceAccountRaw);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: DRIVE_SCOPE,
    }).getClient();
  }

  // Use environment variables instead of JSON files
  const clientId = getEnv('GOOGLE_CLIENT_ID');
  const clientSecret = getEnv('GOOGLE_CLIENT_SECRET');
  const refreshToken = getEnv('GOOGLE_REFRESH_TOKEN');

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Drive credentials missing. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables.');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost');
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  // Refresh the access token
  await oauth2Client.getAccessToken();

  return oauth2Client;
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = String(formData.get('title') || '').trim();
    const username = String(formData.get('username') || '').trim();
    const doctorName = String(formData.get('doctorName') || '').trim();
    const hospitalName = String(formData.get('hospitalName') || '').trim();
    const date = String(formData.get('date') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const type = String(formData.get('type') || '').trim();
    const file = formData.get('file');

    if (!title || !username || !doctorName || !hospitalName || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const resourceDate = new Date(date);
    if (Number.isNaN(resourceDate.getTime())) {
      return NextResponse.json({ error: 'Invalid report date' }, { status: 400 });
    }

    await connectDB();
    const authClient = await getDriveAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const folderId = getEnv('GOOGLE_DRIVE_FOLDER_ID');
    const fileName = `${title.replace(/[^a-zA-Z0-9-_\. ]/g, '_')}_${Date.now()}_${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await drive.files.create({
      requestBody: {
        name: fileName,
        ...(folderId ? { parents: [folderId] } : {}),
      },
      media: {
        mimeType: file.type || 'application/octet-stream',
        body: Readable.from(buffer),
      },
      fields: 'id,webViewLink,webContentLink,name',
    });

    const savedResource = await ResourceLibrary.create({
      username,
      title,
      doctorName,
      hospitalName,
      date: resourceDate,
      subject,
      type,
      driveFileId: upload.data.id,
      driveLink: upload.data.webViewLink,
      downloadLink: upload.data.webContentLink,
      driveFileName: upload.data.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Resource uploaded to Google Drive and saved to library',
      data: {
        id: savedResource._id,
        title,
        username,
        doctorName,
        hospitalName,
        date: savedResource.date.toISOString(),
        subject,
        type,
        driveFileId: savedResource.driveFileId,
        driveLink: savedResource.driveLink,
        downloadLink: savedResource.downloadLink,
        driveFileName: savedResource.driveFileName,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Resource upload error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to upload to Google Drive' }, { status: 500 });
  }
}
