package com.example.MenuService.Service;

import com.example.MenuService.Config.SecurityUtil;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
public class QRCodeService {
    private final SecurityUtil securityUtil;
    public QRCodeService(SecurityUtil securityUtil) {
        this.securityUtil = securityUtil;
    }
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public String generateQRCodeBase64(String data, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        byte[] qrCodeBytes = outputStream.toByteArray();

        return Base64.getEncoder().encodeToString(qrCodeBytes);
    }


     //Generate QR code cho table với URL động
     public String generateTableQRCode(String tableNumber) throws WriterException, IOException {
         String token = securityUtil.createAcessToken(tableNumber);

         String qrContent =
                 frontendUrl +
                         "/menu?table=" + tableNumber +
                         "&token=" + token;


         return generateQRCodeBase64(qrContent, 300, 300);
     }


    /**
     * Generate unique token cho mỗi table
     */

}
