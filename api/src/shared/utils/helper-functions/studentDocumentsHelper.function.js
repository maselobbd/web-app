function getPrimaryDocuments(student) {
    const documentTypes = [
      { property: 'identityDocument', type: 'Identity document' },
      { property: 'academicTranscript', type: 'Academic transcript' },
      { property: 'matricCertificate', type: 'Matric certificate' },
      { property: 'financialStatement', type: 'Financial statement' }
    ];
  
    return documentTypes.map(doc => ({
      blobName: student[doc.property],
      type: doc.type
    }));
  }

  module.exports= getPrimaryDocuments