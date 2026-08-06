package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Entity.Taller;
import com.CertiSafe.secu.Service.ServiceTaller;
import com.CertiSafe.secu.Repository.RepositoryTaller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceTallerimpl implements ServiceTaller {
    private final RepositoryTaller repositoryTaller;

    @Override
    public List<Taller> listarTalleres() {
        return repositoryTaller.findAll();
    }

    @Override
    public Optional<Taller> buscarPorId(Long id) {
        return repositoryTaller.findById(id);
    }

    @Override
    public Taller guardar(Taller taller) {
        return repositoryTaller.save(taller);
    }

    @Override
    public Taller actualizar(Long id, Taller taller) {
        return repositoryTaller.save(taller);
    }

    @Override
    public void desactivar(Long id) {
        Optional<Taller> optional = repositoryTaller.findById(id);
        if (optional.isPresent()) {
            Taller taller = optional.get();
            taller.setEstado(false);
            repositoryTaller.save(taller);
        }
    }
}
