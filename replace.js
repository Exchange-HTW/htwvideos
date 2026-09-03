const fs = require('fs');

const files = [
    'public/itm/becas.html', 'public/itm/faq.html', 'public/itm/index.html', 'public/itm/vpd.html',
    'public/anahuac/faq.html', 'public/anahuac/index.html'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Navbar & Footer
    content = content.replace(/>Contact Lab<\/a>/g, '>Contactar Lab</a>');
    content = content.replace(/<h4>Categories<\/h4>/g, '<h4>Categorías</h4>');
    content = content.replace(/">Contact<\/a>/g, '">Contacto</a>');
    content = content.replace(/<h4>Contact<\/h4>/g, '<h4>Contacto</h4>');
    content = content.replace(/<strong>Contact<\/strong>/g, '<strong>Contacto</strong>');
    content = content.replace(/Saarbrücken, Germany/g, 'Saarbrücken, Alemania');
    content = content.replace(/All rights reserved\./g, 'Todos los derechos reservados.');
    
    // FAQ
    content = content.replace(/<span class="faq-subtitle">Internship<\/span>/g, '<span class="faq-subtitle">Prácticas / Residencia</span>');

    // Email generator section
    content = content.replace(/Join the/g, 'Únete a la');
    content = content.replace(/Generate a standardized application email to contact our Principal Investigators\./g, 'Genera un correo de aplicación estandarizado para contactar a nuestros Investigadores Principales.');
    content = content.replace(/Full\s+Name/g, 'Nombre Completo');
    content = content.replace(/Position\s+of Interest/g, 'Puesto de Interés');
    content = content.replace(/Select a position\.\.\./g, 'Selecciona un puesto...');
    content = content.replace(/>Ph\.D\. Student</g, '>Estudiante de Doctorado (Ph.D.)<');
    content = content.replace(/>Postdoctoral Researcher</g, '>Investigador Posdoctoral<');
    content = content.replace(/>Master Thesis Student</g, '>Estudiante de Tesis de Maestría<');
    content = content.replace(/>Research Assistant</g, '>Asistente de Investigación<');
    content = content.replace(/Lab \/ Research Area of Interest/g, 'Laboratorio / Área de Investigación de Interés');
    content = content.replace(/Select a lab\.\.\./g, 'Selecciona un laboratorio...');
    content = content.replace(/>Exchange Students</g, '>Estudiantes de Intercambio<');
    
    content = content.replace(/Brief Introduction &amp; Motivation/g, 'Breve Introducción y Motivación');
    content = content.replace(/\(2-3 short paragraphs\)/g, '(2-3 párrafos cortos)');
    content = content.replace(/I am writing to express my interest in joining the SNN-Unit\.\.\.&#10;&#10;My background is in \[Field\] and I have experience with\.\.\.&#10;&#10;I am particularly interested in your work on\.\.\./g, 'Escribo para expresar mi interés en unirme a la SNN-Unit...&#10;&#10;Tengo formación en [Campo] y experiencia en...&#10;&#10;Estoy particularmente interesado/a en su investigación sobre...');
    content = content.replace(/I am an engineering student from Universidad Anáhuac writing to express my interest in joining the SNN-Unit\.\.\./g, 'Soy un estudiante de ingeniería de la Universidad Anáhuac escribiendo para expresar mi interés en unirme a la SNN-Unit...');

    content = content.replace(/>Generate Email Draft</g, '>Generar Borrador de Correo<');
    content = content.replace(/Preview &amp; Send/g, 'Vista Previa y Enviar');
    content = content.replace(/>To:</g, '>Para:<');
    content = content.replace(/>Subject:</g, '>Asunto:<');
    content = content.replace(/>Body:</g, '>Cuerpo:<');
    content = content.replace(/>Copy Text</g, '>Copiar Texto<');
    content = content.replace(/>Open in Mail App</g, '>Abrir en la App de Correo<');

    // Anahuac specific
    content = content.replace(/>VIDEO</g, '>Video<');

    fs.writeFileSync(f, content, 'utf8');
});
console.log('Done replacing translations!');
