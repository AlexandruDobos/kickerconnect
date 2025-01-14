package kickerConnect;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		System.out.println("App started");
	}

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.authorizeHttpRequests(authorize -> {
					try {
						authorize.requestMatchers("/**")
								.permitAll()
								.anyRequest().authenticated()
								.and()
								.formLogin(formLogin -> {
									try {
										formLogin.init(http);
									} catch (Exception e) {
										throw new RuntimeException(e);
									}
								})
								.httpBasic(HttbBasic -> HttbBasic.init(http));
					} catch (Exception e) {
						throw new RuntimeException(e);
					}
				});

		http.csrf(AbstractHttpConfigurer::disable).cors(AbstractHttpConfigurer::disable);

		return http.build();

	}
}
