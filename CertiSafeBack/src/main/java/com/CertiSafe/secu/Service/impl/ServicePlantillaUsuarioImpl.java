package com.CertiSafe.secu.Service.impl;

import com.CertiSafe.secu.Service.ServicePlantillaUsuario;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ServicePlantillaUsuarioImpl
        implements ServicePlantillaUsuario {


    @Override
    public ByteArrayInputStream generarPlantilla() {

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream =
                     new ByteArrayOutputStream()) {


            // =========================================
            // HOJA USUARIOS
            // =========================================

            Sheet hojaUsuarios =
                    workbook.createSheet("Usuarios");


            // =========================================
            // ESTILO ENCABEZADO
            // =========================================

            CellStyle estiloEncabezado =
                    workbook.createCellStyle();

            Font fuenteEncabezado =
                    workbook.createFont();

            fuenteEncabezado.setBold(true);

            estiloEncabezado.setFont(
                    fuenteEncabezado
            );

            estiloEncabezado.setAlignment(
                    HorizontalAlignment.CENTER
            );


            // =========================================
            // ENCABEZADOS
            // =========================================

            Row encabezado =
                    hojaUsuarios.createRow(0);

            String[] columnas = {
                    "Documento",
                    "Nombre",
                    "Apellido",
                    "Correo",
                    "Rol"
            };


            for (int i = 0; i < columnas.length; i++) {

                Cell celda =
                        encabezado.createCell(i);

                celda.setCellValue(
                        columnas[i]
                );

                celda.setCellStyle(
                        estiloEncabezado
                );
            }


            // =========================================
            // EJEMPLO
            // =========================================

            Row ejemplo =
                    hojaUsuarios.createRow(1);

            ejemplo.createCell(0)
                    .setCellValue("100000001");

            ejemplo.createCell(1)
                    .setCellValue("Jhon");

            ejemplo.createCell(2)
                    .setCellValue("Suarez");

            ejemplo.createCell(3)
                    .setCellValue("jhon@empresa.com");

            ejemplo.createCell(4)
                    .setCellValue("OPERARIO");


            // =========================================
            // ANCHO COLUMNAS
            // =========================================

            for (int i = 0; i < columnas.length; i++) {

                hojaUsuarios.autoSizeColumn(i);
            }


            // =========================================
            // LISTA DESPLEGABLE DE ROLES
            // =========================================

            DataValidationHelper validationHelper =
                    hojaUsuarios.getDataValidationHelper();

            DataValidationConstraint constraint =
                    validationHelper.createExplicitListConstraint(
                            new String[]{
                                    "OPERARIO",
                                    "CAPACITADOR"
                            }
                    );

            CellRangeAddressList rango =
                    new CellRangeAddressList(
                            1,
                            1000,
                            4,
                            4
                    );

            DataValidation validacion =
                    validationHelper.createValidation(
                            constraint,
                            rango
                    );

            hojaUsuarios.addValidationData(
                    validacion
            );


            // =========================================
            // HOJA INSTRUCCIONES
            // =========================================

            Sheet hojaInstrucciones =
                    workbook.createSheet(
                            "Instrucciones"
                    );


            String[] instrucciones = {

                    "CARGA MASIVA DE USUARIOS - CERTISAFE",

                    "",

                    "Complete la hoja 'Usuarios' " +
                            "utilizando una fila por usuario.",

                    "",

                    "CAMPOS OBLIGATORIOS:",

                    "Documento",

                    "Nombre",

                    "Apellido",

                    "Correo",

                    "Rol",

                    "",

                    "ROLES PERMITIDOS:",

                    "OPERARIO",

                    "CAPACITADOR",

                    "",

                    "IMPORTANTE:",

                    "No incluya contraseñas.",

                    "El sistema generará automáticamente " +
                            "la contraseña.",

                    "No modifique los nombres de las columnas.",

                    "No agregue columnas adicionales.",

                    "El archivo debe conservar el formato .xlsx."
            };


            for (int i = 0;
                 i < instrucciones.length;
                 i++) {

                Row fila =
                        hojaInstrucciones.createRow(i);

                Cell celda =
                        fila.createCell(0);

                celda.setCellValue(
                        instrucciones[i]
                );
            }


            hojaInstrucciones.setColumnWidth(
                    0,
                    10000
            );


            // =========================================
            // ESCRIBIR ARCHIVO
            // =========================================

            workbook.write(
                    outputStream
            );

            return new ByteArrayInputStream(
                    outputStream.toByteArray()
            );


        } catch (IOException e) {

            throw new RuntimeException(
                    "No se pudo generar la plantilla Excel.",
                    e
            );
        }
    }
}
