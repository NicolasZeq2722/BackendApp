package com.app.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void enviarEmail(String destinatario, String asunto, String contenido) {
        if (mailSender == null) {
            System.out.println("Email no configurado. Simulando envío a: " + destinatario);
            System.out.println("Asunto: " + asunto);
            System.out.println("Contenido: " + contenido);
            return;
        }

        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(destinatario);
            mensaje.setSubject(asunto);
            mensaje.setText(contenido);
            mensaje.setFrom("noreply@workable.com");

            mailSender.send(mensaje);
            System.out.println("Email enviado a: " + destinatario);
        } catch (Exception e) {
            System.err.println("Error al enviar email: " + e.getMessage());
        }
    }
}
