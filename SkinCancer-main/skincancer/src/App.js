import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress, Typography, Paper } from "@mui/material";
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let confidence = 0;

  const diseaseInfo = {
    '4': { name: "Melanocytic Nevi", solution: "Genellikle zararsızdır, ancak şüpheli durumlarda dermatoloğa başvurulmalıdır." },
    '6': { name: "Melanoma", solution: "Acil tıbbi müdahale gerektirir. Dermatolog veya onkologla görüşün." },
    '2': { name: "Benign Keratosis-like Lesions", solution: "Genellikle zararsızdır, ancak tedavi gerekliyse dermatoloğa başvurulmalıdır." },
    '1': { name: "Basal Cell Carcinoma", solution: "Erken evrede tespit edilirse tedavisi kolaydır. Dermatologla görüşün." },
    '5': { name: "Pyogenic Granulomas and Hemorrhage", solution: "Genellikle cerrahi müdahale gerekebilir. Dermatolog veya cerrahla görüşün." },
    '0': { name: "Actinic Keratoses and Intraepithelial Carcinomae", solution: "Erken evrede tedavi edilmelidir. Dermatologla görüşün." },
    '3': { name: "Dermatofibroma", solution: "Genellikle zararsızdır, ancak büyüme veya değişiklik fark edilirse dermatoloğa başvurulmalıdır." },
    'unknown': { name: "Bilinmeyen Hastalık", solution: "Henüz bir çözüm önerisi bulunmamaktadır." }
  };

  const getDiagnosisMessage = (predictedClass) => {
    return diseaseInfo[predictedClass] || diseaseInfo['unknown'];
  };

  const clearData = () => {
    setData(null);
    setSelectedFile(null);
    setPreview(null);
  };

  const NewPage = () => {
    window.open("aa.html", "_blank", "noreferrer");
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Bellek sızıntılarını önlemek için cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    const sendFile = async () => {
      if (selectedFile) {
        let formData = new FormData();
        formData.append("file", selectedFile);

        try {
          const res = await axios.post("http://localhost:8002/predict", formData);

          if (res.status === 200) {
            setData(res.data);
          }
        } catch (error) {
          console.error("Dosya gönderilirken hata oluştu:", error);
        }

        setIsLoading(false);
      }
    };

    if (preview) {
      setIsLoading(true);
      sendFile();
    }
  }, [preview, selectedFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <Container style={{ background: `url(${preview}) no-repeat center/cover`, height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        {/* Sol taraf: Dosya yükleme ve önizleme alanı */}
        <Grid item xs={12} md={6}>
          <Card style={{ margin: 16, padding: 16 }}>
            <DropzoneArea
              acceptedFiles={['image/*']}
              dropzoneText={"Resim dosyasını sürükleyin veya tıklayarak seçin"}
              onChange={onSelectFile}
              filesLimit={1}
              showAlerts={false}
              dropzoneClass={{ minHeight: 200, border: '2px dashed #3f51b5', backgroundColor: '#e0e0e0' }}
            />
            {preview && (
              <CardActionArea>
                <CardMedia style={{ height: 300 }} image={preview} component="img" title="Görüntü Önizlemesi" />
              </CardActionArea>
            )}
            <CardContent>
              {data ? (
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Hastalık Türü:</TableCell>
                        <TableCell align="right">Güven:</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">{getDiagnosisMessage(data.predicted_class).name}</TableCell>
                        <TableCell align="right">{confidence}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1">Bir görüntü yükleyin.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ taraf: Çözüm reçetesi ve yükleme durumu */}
        <Grid item xs={12} md={6}>
          <Card style={{ margin: 16, padding: 16 }}>
            {data && (
              <CardContent>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Çözüm Reçetesi:</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{getDiagnosisMessage(data.predicted_class).solution}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            )}
            {isLoading && (
              <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress color="secondary" />
                <Typography variant="h6" noWrap>İşleniyor</Typography>
              </CardContent>
            )}
          </Card>
        </Grid>

        {/* Alt kısım: Temizle ve Sonraki butonları */}
        {data && (
          <Grid item xs={12} style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={clearData} style={{ marginRight: 16 }}>Temizle</Button>
            <Button variant="contained" color="primary" onClick={NewPage}>Sonraki</Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ImageUpload;
