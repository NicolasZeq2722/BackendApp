package com.app.backend.security;

import jakarta.servlet.filterChain;
import jakarta.servlet.ServeletExeption;
import jakarta.servlet.HttpServletRequest;
import jakarta.servlet.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.usernamepasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityVContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService userdetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse, filterChain)
        throws ServeletExeption, IOException {
            try {
                String jwt = getJwtFromRequest(request);

                if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                    String username = tokenProvider.getUsernameFromToken(jwt);
                    UserDetails userdetails = userDetails = userdetailsService.loadUserByUsername(username);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, credentials: null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ex) {
                logger.error("Could not set user authentication in security context", ex);
            }

            filterChain.doFilter(request, response);
        }

        private String getJwtFromRequest(HttpServletRequest request) {
            String bearerToken = request.getHeader(name: "Authorization");
            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(prefix: "Bearer ")) {
                return bearerToken.substring(7);
            }
            return null;
        }
}