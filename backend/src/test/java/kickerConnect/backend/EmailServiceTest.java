package kickerConnect.backend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.junit4.SpringRunner;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(SpringRunner.class)
@SpringBootTest
public class EmailServiceTest {

    @Autowired
    private JavaMailSender emailSender;

    @Test
    public void testSendEmail() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("dobosalexandru2502@example.com");  // Schimbă cu adresa ta de email
        message.setSubject("Test Email");
        message.setText("This is a test email from Spring Boot.");
        emailSender.send(message);
    }
}
