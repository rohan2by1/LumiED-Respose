import { QRCodeSVG } from 'qrcode.react'; // ✅ Correct named import
import React from 'react';
import './Certificate.css';

export default function CertificatePage() {
    const certificateId = 'CERT-' + Date.now(); // ✅ Unique certificate ID
    const verificationUrl = `https://www.example.com/verify-certificate?id=${certificateId}`;

    const handleDownload = () => {
        const element = document.getElementById("certificate-card");

        import('html2canvas').then(html2canvas => {
            html2canvas.default(element).then((canvas) => {
                const link = document.createElement('a');
                link.download = 'certificate.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        });
    };

    return (
        <div className="certificate-container">
            <div id="certificate-card" className="certificate-card">
                <h1 className="certificate-title">🏆 Certificate of Completion</h1>
                <p className="certificate-subtitle">This is to certify that</p>
                <h2 className="certificate-name">John Doe</h2>
                <p className="certificate-course-subtitle">has successfully completed the course:</p>
                <h3 className="certificate-course-name">Python Basics</h3>
                <p className="certificate-duration">
                    Duration: <strong>4 Weeks</strong>
                </p>

                <div className="certificate-footer">
                    <div className="signature-section">
                        <img src="/signature1.png" alt="Signature" className="signature-img" />
                        <p className="instructor-name">Mr. Smith</p>
                        <p className="instructor-role">Instructor</p>
                    </div>

                    <div className="issue-date">
                        <p>Issued on:</p>
                        <p>April 30, 2025</p>
                    </div>

                    {/* ✅ QR Code Section */}
                    <div className="qr-code">
                        <QRCodeSVG value={verificationUrl} size={80} />
                        <p className="qr-caption">Scan to verify</p>
                    </div>
                </div>

                {/* ✅ Certificate ID and Link inside certificate */}
                <div className="certificate-meta">
                    <p className="certificate-id">Certificate ID: <strong>{certificateId}</strong></p>
                    <p className="certificate-link">
                        Verify: <a href={verificationUrl} target="_blank" rel="noopener noreferrer">{verificationUrl}</a>
                    </p>
                </div>
            </div>

            {/* Actions (optional) */}
            <div className="certificate-download">
                <button onClick={handleDownload} className="download-btn">
                    Download Certificate
                </button>
            </div>
        </div>
    );
}