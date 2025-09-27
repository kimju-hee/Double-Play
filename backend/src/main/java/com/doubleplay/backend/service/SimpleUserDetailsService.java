package com.doubleplay.backend.service;

import com.doubleplay.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimpleUserDetailsService implements UserDetailsService {
    private final UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var u = usersRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("not found"));
        return User.withUsername(u.getEmail()).password(u.getPassword()).roles(u.getRole()).build();
    }
}