import { useState } from "react";
import { 
  Autocomplete, TextField, Container, Typography, Box, Button, Divider, Tabs, Tab, IconButton, CircularProgress, Radio, RadioGroup, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControl, FormGroup, FormLabel, 
  Popover
} from "@mui/material";
import { FilterList } from "@mui/icons-material";
import logo from "./assets/logo.png";
import { Public } from "@mui/icons-material";
import namIcon from "./assets/nam.avif";
import latamIcon from "./assets/ltma.png";
import emeaIcon from "./assets/emea.png";
import apacIcon from "./assets/apac.jpg";
import { Search } from "@mui/icons-material";


function App() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);
  const [clickedCardId, setClickedCardId] = useState<string | null>(null);
  const [smartAssistQuery, setSmartAssistQuery] = useState("");
  const [smartDialogOpen, setSmartDialogOpen] = useState(false);
  const [smartSearchResult, setSmartSearchResult] = useState<any | null>(null);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [ruleData, setRuleData] = useState<any | null>(null);
  const [selectedMdrm, setSelectedMdrm] = useState<string | null>(null);
  const [formTabIndex, setFormTabIndex] = useState(0);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [mdrmPopoverAnchorEl, setMdrmPopoverAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMdrms, setSelectedMdrms] = useState<string[]>([]);



  const regionsList = ["NAM", "LATAM", "EMEA", "APAC"];
  const formdata = [
    { id: "01", formName: "FFIEC031", region: "NAM", country: "USA", date: "12 Feb 2020" },
    { id: "02", formName: "FRY9C", region: "NAM", country: "CANADA", date: "12 Feb 2021" },
    { id: "03", formName: "FFIEC031", region: "NAM", country: "USA", date: "12 Feb 2022" },
    { id: "04", formName: "FRY9C", region: "NAM", country: "CANADA", date: "12 Feb 2023" },
    { id: "05", formName: "FFIEC031", region: "NAM", country: "USA", date: "12 Feb 2024" },
  
    { id: "06", formName: "FRY9C", region: "LATAM", country: "BRAZIL", date: "12 Feb 2020" },
    { id: "07", formName: "FFIEC031", region: "LATAM", country: "MEXICO", date: "12 Feb 2021" },
  
    { id: "08", formName: "FRY9C", region: "EMEA", country: "UK", date: "12 Feb 2022" },
    { id: "09", formName: "FFIEC031", region: "EMEA", country: "FRANCE", date: "12 Feb 2023" },
  
    { id: "10", formName: "FRY9C", region: "APAC", country: "INDIA", date: "12 Feb 2020" },
    { id: "11", formName: "FFIEC031", region: "APAC", country: "AUSTRALIA", date: "12 Feb 2021" },
    { id: "12", formName: "FRY9C", region: "APAC", country: "AUSTRALIA", date: "12 Feb 2022" },
    { id: "13", formName: "FFIEC031", region: "APAC", country: "AUSTRALIA", date: "12 Feb 2023" },
    { id: "14", formName: "FRY9C", region: "APAC", country: "AUSTRALIA", date: "12 Feb 2024" },
    { id: "15", formName: "FFIEC031", region: "APAC", country: "AUSTRALIA", date: "12 Feb 2025" },
  ];
  
  const [results, setResults] = useState<any[]>(formdata);
  const [clickedCardIndex, setClickedCardIndex] = useState<number | null>(null);

  const handleLineItemClick = (event: React.MouseEvent<HTMLElement>, mdrms: string[]) => {
    setSelectedMdrms(mdrms);
    setMdrmPopoverAnchorEl(event.currentTarget);
  };
  
  const handleMdrmPopoverClose = () => {
    setMdrmPopoverAnchorEl(null);
    setSelectedMdrms([]);
  };
  
  const mdrmPopoverOpen = Boolean(mdrmPopoverAnchorEl);
  

  const handleMdrmClick = async (mdrm: string) => {
    try {
      const response = await fetch(`http://3.86.232.151:8000/api/search_rules/?value=${encodeURIComponent(mdrm)}`);
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        setRuleData(data.results[0]);
        setSelectedMdrm(mdrm);
        setRuleDialogOpen(true);
      } else {
        setRuleData(null);
        console.warn("No rules found for this MDRM");
      }
    } catch (err) {
      console.error("Error fetching rule data:", err);
    }
  };
  
  

  // const handleCardClick = (item: any) => {
  //   setSelectedCard(item);
  //   setCardDialogOpen(true);
  // };

  // const handleCardClick = (item: any, cardId: string) => {
  //   setClickedCardId(cardId);
  //   setTimeout(() => {
  //     setSelectedCard(item);
  //     setCardDialogOpen(true);
  //     setClickedCardId(null);
  //   }, 300); // match animation duration
  // };
  
  const handleCardClick = (item: any) => {
    let pdfFilename = item.formName === "FFIEC031" ? "FFIEC031.pdf" : "FRY_9C.pdf";
    const pdfUrl = `/pdfs/${pdfFilename}`;

    window.open(pdfUrl, "_blank");
};


  
  const handleCardDialogClose = () => {
    setCardDialogOpen(false);
  };

  const regionIcons: { [key: string]: string } = {
    NAM: namIcon,
    LATAM: latamIcon,
    EMEA: emeaIcon,
    APAC: apacIcon,
  };
  const regionCountryMap: { [region: string]: string[] } = {
    NAM: ["USA", "Canada"],
    LATAM: ["Brazil", "Mexico"],
    EMEA: ["UK", "Germany", "France"],
    APAC: ["India", "Australia", "China"],
  };
  
  const [selectedRegions, setSelectedRegions] = useState<string[]>([...regionsList]);

  const frequentlySearchedCountries = Array.from(
    new Set(
      selectedRegions.flatMap((region) => regionCountryMap[region] || [])
    )
  );
  

  const frequentlyAskedQueries = [
    "Available-for-sale debt securities",
    "Federal funds sold",
    "Loans and leases",
  ];

  // const handleSmartSearch = async () => {
  //   if (!query.trim()) return;
  
  //   try {
  //     const response = await fetch(`http://3.86.232.151:8000/api/search/?query=${encodeURIComponent(query)}`);
  //     const data = await response.json();
  
  //     if (data && !data.error) {
  //       setSmartSearchResult(data.results[0]);
  //       setSmartDialogOpen(true);
  //       setSmartAssistQuery(""); // optional
  //     } else {
  //       console.error("No matching record found or error:", data.error);
  //     }
  //   } catch (err) {
  //     console.error("Smart search request failed:", err);
  //   }
  // };
  
  

  // const handleSearch = async () => {
  //   if (!query.trim()) {
  //     setError(true);
  //     setShowResults(false);
  //     return;
  //   }

  //   setError(false);
  //   setLoading(true);

  //   try {
  //     const response = await fetch(`http://3.86.232.151:8000/api/search/?query=${query}`);
  //     const data = await response.json();

  //     if (data.results && data.results.length > 0) {
  //       setResults(data.results);
  //       setShowResults(true);

  //       const initialSelectedValues: { [key: number]: string } = {};
  //       data.results.forEach((item: any, index: number) => {
  //         initialSelectedValues[index] = item.metadata.value?.[0] || "";
  //       });
  //       setSelectedValues(initialSelectedValues);
  //     } else {
  //       setResults([]);
  //       setShowResults(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setShowResults(false);
  //   }

  //   setLoading(false);
  // };

  const handleSmartSearch = async () => {
    if (!query.trim()) return;
  
    try {
      const response = await fetch(`http://3.86.232.151:8000/api/search/?query=${encodeURIComponent(query)}`);
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        setSmartSearchResult(data.results[0]);  // Store in state
        setSelectedCard(null);                  // Optional: Clear card state if needed
        setSmartAssistQuery("");                // Reset smart assist filter
      } else {
        setSmartSearchResult(null);
      }
    } catch (err) {
      console.error("Search request failed:", err);
    }
  };
  

  const fetchRuleData = async (value: string) => {
    try {
      const response = await fetch(`http://3.86.232.151:8000/api/search_rules/?value=${value}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setRuleData(data.results[0]); // Assuming one match per value
      } else {
        setRuleData(null);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  };

  // const handleValueChange = (index: number, newValue: string) => {
  //   setSelectedValues((prev) => ({ ...prev, [index]: newValue }));
  //   setSelectedValue(newValue);
  //   fetchRuleData(newValue);
  // };

  const toggleRegionSelection = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  return (
    <Container maxWidth={false} sx={{ width: "100%", px: 2 }}>
      <Box display="flex" alignItems="center" gap={2} width="100%" 
      py={1} sx={{ backgroundColor: "#f8f9fa" }}></Box>

<Box display="flex" alignItems="center" justifyContent="space-between" py={2} sx={{ backgroundColor: "#f8f9fa", px: 3 }}>
  <img src={logo} alt="Company Logo" style={{ height: 40 }} />

  <Box display="flex" alignItems="center" gap={2}>
  <Autocomplete
  freeSolo
  options={frequentlyAskedQueries}
  inputValue={query}
  onInputChange={(event, newInputValue) => setQuery(newInputValue)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSmartSearch();
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      size="small"
      placeholder="Smart Assist"
      variant="outlined"
      InputProps={{
        ...params.InputProps,
        endAdornment: <Search sx={{ color: "#888" }} />,
      }}
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        minWidth: 400,
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
      }}
    />
  )}
/>


    <IconButton 
      color="secondary"
      sx={{
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        "&:hover": { backgroundColor: "#e0e0e0" },
        width: "50px", height: "50px"
      }}
      onClick={() => setRegionDialogOpen(true)}
    >
      <Public />
    </IconButton>
  </Box>
</Box>


    <Divider sx={{ mb: 3 }} />


      {/* Region Selection Dialog */}
      <Dialog open={regionDialogOpen} onClose={() => setRegionDialogOpen(false)}>
        <DialogTitle>Select Regions</DialogTitle>

    <DialogContent>
      <Typography variant="subtitle1" gutterBottom>
        Region
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center" mb={3}>
      {regionsList.map((region) => (
        <Box
          key={region}
          onClick={() => toggleRegionSelection(region)}
          sx={{
            width: 80,
            cursor: "pointer",
            textAlign: "center",
            opacity: selectedRegions.includes(region) ? 1 : 0.4,
            border: selectedRegions.includes(region) ? "2px solid #007BFF" : "2px solid transparent",
            borderRadius: 2,
            padding: "8px",
            transition: "0.2s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <img src={regionIcons[region]} alt={region} style={{ width: 40, height: 40 }} />
          <Typography variant="caption" fontWeight="bold">{region}</Typography>
        </Box>
      ))}
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Frequently searched countries
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
      {frequentlySearchedCountries.map((country) => (
        <Box
          key={country}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "8px 16px",
            backgroundColor: "#f9f9f9",
            fontWeight: "bold",
          }}
        >
          {country}
        </Box>
      ))}
      </Box>
    </DialogContent>

    <DialogActions>
      <Button onClick={() => setRegionDialogOpen(false)} color="primary">Done</Button>
    </DialogActions>
      </Dialog>

{!smartSearchResult && (
  <Box
  display="flex"
  flexDirection="column"
  gap={4}
  mt={3}
  p={3}
  borderRadius={2}
  bgcolor="white"
  boxShadow={2}
  sx={{ mb: 5, maxHeight: "80vh", overflowY: "auto" }}
>
  {selectedRegions.map((region) => {
    const regionResults = results.filter(
      (item) => item.region === region
    );

    return (
      <Box key={region} mb={4}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {region}
      </Typography>
    
      <Box
        display="flex"
        gap={2}
        overflow="auto"
        sx={{
          whiteSpace: "nowrap",
          pb: 1,
          pr: 1,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 3,
          },
        }}
      >
        {regionResults.map((item, index) => {
  const cardId = `${region}-${item.id}`;


  return (
    <Box
      key={cardId}
      p={3}
      minWidth={240}
      height={220}
      flexShrink={0}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#ffffff"
      boxShadow={2}
      borderRadius={3}
      border="1px solid #e0e0e0"
      sx={{
        cursor: "pointer",
        transform: clickedCardId === cardId ? "scale(1.05)" : "scale(1)",
        opacity: clickedCardId === cardId ? 0.6 : 1,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          backgroundColor: "#f5faff",
        },
      }}
      onClick={() => handleCardClick(item)}
    >
      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
        {item.formName || "N/A"}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        {item.date || "N/A"}
      </Typography>
      <Typography variant="subtitle2" color="textSecondary">
        {item.country || "N/A"}
      </Typography>
    </Box>
  );
})}

      </Box>
    </Box>
    );
  })}
</Box>

)}

{smartSearchResult && (
  <button
    onClick={() => setSmartSearchResult(null)} // Clears search results and goes back
    style={{
      marginBottom: "10px",
      padding: "8px 16px",
      border: "none",
      backgroundColor: "#007BFF",
      color: "white",
      cursor: "pointer",
      borderRadius: "5px"
    }}> Back
  </button>
)}


{smartSearchResult && (
  
  <Box
    mt={4}
    p={3}
    borderRadius={2}
    bgcolor="white"
    boxShadow={2}
  >
    <Typography variant="h6" fontWeight="bold" mb={2}>Search Result</Typography>

    {/* Get available form names dynamically */}
    {(() => {
      const formNames = Object.keys(smartSearchResult.metadata || {});
      return (
        <>
          {/* Tabs for FFIEC031, FRY9C, etc. */}
<Tabs
  value={formTabIndex}
  onChange={(e, newVal) => setFormTabIndex(newVal)}
  variant="scrollable"
  scrollButtons="auto"
  sx={{ mb: 2 }}
>
  {Object.keys(smartSearchResult.metadata || {}).map((formName, idx) => (
    <Tab key={idx} label={formName} />
  ))}
</Tabs>


          {/* Tab content for selected form */}
          {formNames.map((form, index) => {
            const currentFormName = Object.keys(smartSearchResult.metadata || {})[formTabIndex];
            const formData = smartSearchResult.metadata[currentFormName];
            if (index !== formTabIndex) return null;

            return (
              <Box key={form}>

                {/* MDRM Table */}
                <Box mt={2}>
                  <Box component="table" width="100%" sx={{ borderCollapse: "collapse" }}>
                    <Box component="thead">
                      <Box component="tr">
                        <Box component="th" sx={{ borderBottom: "2px solid #ccc", textAlign: "left", py: 1 }}>
                          Line Item
                        </Box>
                        <Box component="th" sx={{ borderBottom: "2px solid #ccc", textAlign: "left", py: 1 }}>
                          Schedule Name
                        </Box>
                        <Box component="th" sx={{ borderBottom: "2px solid #ccc", textAlign: "left", py: 1 }}>
                          Schedule Category
                        </Box>
                        <Box component="th" sx={{ borderBottom: "2px solid #ccc", textAlign: "left", py: 1 }}>
                          Regulatory Code
                        </Box>
                        <Box component="th" sx={{ borderBottom: "2px solid #ccc", textAlign: "left", py: 1 }}>
                          Similarity Index
                        </Box>
                      </Box>
                    </Box>
                    <Box component="tbody">
  {formData.map((entry: any, idx: number) => (
    <Box component="tr" key={`${entry.line}-${idx}`}>
      <Box
        component="td"
        sx={{
          py: 1,
          color: "primary.main",
          cursor: "pointer",
          textDecoration: "underline",
          "&:hover": { color: "secondary.main" },
        }}
        onClick={(e) => handleLineItemClick(e, entry.mdrm_values)}
      >
        {entry.line}
      </Box>

      <Box component="td" sx={{ py: 1 }}>
        {entry["Schedule Name"]}
      </Box>
      <Box component="td" sx={{ py: 1 }}>
        {entry["Schedule Category"]}
      </Box>
      <Box component="td" sx={{ py: 1 }}>
        {Array.isArray(entry["Regulatory Code"])
          ? entry["Regulatory Code"].join(", ")
          : entry["Regulatory Code"]}
      </Box>
      <Box component="td" sx={{ py: 1 }}>
        {entry.similarity_index}
      </Box>
    </Box>
  ))}
</Box>

                  </Box>
                </Box>
              </Box>
            );
          })}
        </>
      );
    })()}
  </Box>
)}

<Popover
  open={mdrmPopoverOpen}
  anchorEl={mdrmPopoverAnchorEl}
  onClose={handleMdrmPopoverClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
>
  <Box p={2}>
    <Typography fontWeight="bold" mb={1}>MDRM Values</Typography>
    <Box display="flex" flexDirection="column" gap={1}>
      {selectedMdrms.map((mdrm, idx) => (
        <Typography
          key={idx}
          sx={{
            cursor: "pointer",
            color: "primary.main",
            textDecoration: "underline",
            "&:hover": { color: "secondary.main" },
          }}
          onClick={() => handleMdrmClick(mdrm)}
        >
          {mdrm}
        </Typography>
      ))}
    </Box>
  </Box>
</Popover>


<Dialog
  open={cardDialogOpen}
  onClose={handleCardDialogClose}
  maxWidth="md"
  fullWidth
  sx={{
    "& .MuiDialog-paper": {
      minHeight: "500px",
      padding: 2,
    },
  }}
>
<DialogTitle sx={{ px: 3, py: 2 }}>
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
      {selectedCard?.form_name}
    </Typography>

    {/* Smart Assist Search Bar with Icon */}
    <TextField
  size="small"
  placeholder="Smart Assist"
  variant="outlined"
  value={smartAssistQuery}
  onChange={(e) => setSmartAssistQuery(e.target.value)}
  InputProps={{
    endAdornment: (
      <Search sx={{ color: "#888" }} />
    ),
  }}
  sx={{
    minWidth: 250,
    backgroundColor: "white",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  }}
/>

  </Box>
</DialogTitle>

<DialogContent dividers>
  <Box display="flex" gap={4} flexDirection={{ xs: "column", md: "row" }}>

    {/* Left Section */}
    <Box flex={1}>
      

      <Typography variant="subtitle1" fontWeight="bold">Date:</Typography>
      <Typography mb={2}>{selectedCard?.date}</Typography>

      <Typography variant="subtitle1" fontWeight="bold">Country:</Typography>
      <Typography mb={2}>{selectedCard?.country}</Typography>

      <Typography variant="subtitle1" fontWeight="bold">Content:</Typography>
      <Typography mb={2}>{selectedCard?.content}</Typography>

      <Typography variant="subtitle1" fontWeight="bold">Schedule Names:</Typography>
      <Typography mb={2}>{selectedCard?.schedule_names?.join(", ")}</Typography>

      <Typography variant="subtitle1" fontWeight="bold">Schedule Category:</Typography>
      <Typography mb={2}>{selectedCard?.schedule_category}</Typography>

      <Typography variant="subtitle1" fontWeight="bold">Regulatory Codes:</Typography>
      <Typography mb={2}>{selectedCard?.regulatory_codes?.join(", ")}</Typography>
    </Box>

    {/* Right Section */}
    <Box flex={1}>

    
  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
    MDRM Values:
  </Typography>
  <Box component="table" width="100%" sx={{ borderCollapse: "collapse" }}>
    <thead>
      <Box component="tr">
        <Box component="th" sx={{ border: "1px solid #ccc", p: 1, fontWeight: "bold", textAlign: "left" }}>MDRM</Box>
        <Box component="th" sx={{ border: "1px solid #ccc", p: 1, fontWeight: "bold", textAlign: "left" }}>Taxonomy ID</Box>
      </Box>
    </thead>
    <tbody>
      {selectedCard?.mdrm_details?.map((val: any, idx: number) => (
        <Box
          component="tr"
          key={idx}
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f5f5f5" }
          }}
          onClick={() => console.log("MDRM clicked:", val.mdrm)}
        >
          <Box component="td" sx={{ border: "1px solid #ccc", p: 1, color: "#1976d2", fontWeight: "bold" }}>
            {val.mdrm}
          </Box>
          <Box component="td" sx={{ border: "1px solid #ccc", p: 1 }}>
            {val.taxonomy_id}
          </Box>
        </Box>
      ))}
    </tbody>
  </Box>
</Box>




  </Box>
</DialogContent>


  <DialogActions>
    <Button onClick={handleCardDialogClose} variant="contained" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

<Dialog
  open={smartDialogOpen}
  onClose={() => setSmartDialogOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    <Typography fontWeight="bold" fontSize="1.5rem">
      {smartSearchResult?.form_name}
    </Typography>
  </DialogTitle>

  <DialogContent dividers>
    <Box display="flex" gap={4} flexDirection={{ xs: "column", md: "row" }}>
      {/* Left Section like before */}
      <Box flex={1}>
        <Typography variant="subtitle1" fontWeight="bold">Content:</Typography>
        <Typography mb={1}>{smartSearchResult?.content}</Typography>

        <Typography variant="subtitle1" fontWeight="bold">Form Names:</Typography>
        <Typography mb={1}>{smartSearchResult?.metadata?.formname?.join(", ")}</Typography>

        <Typography variant="subtitle1" fontWeight="bold">Schedule Names:</Typography>
        <Typography mb={1}>{smartSearchResult?.metadata?.["Schedule Name"]?.join(", ")}</Typography>

        <Typography variant="subtitle1" fontWeight="bold">Schedule Categories:</Typography>
        <Typography mb={1}>{smartSearchResult?.metadata?.["Schedule Category"]}</Typography>

        <Typography variant="subtitle1" fontWeight="bold">Regulatory Code:</Typography>
        <Typography mb={2}>{smartSearchResult?.metadata?.["Regulatory Code"]?.join(", ")}</Typography>

      </Box>

      {/* Right Tab Section */}
      <Box flex={1}>
  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
    Matched Values
  </Typography>

  <Box component="table" width="100%" sx={{ borderCollapse: "collapse" }}>
    <Box component="thead">
      <Box component="tr">
        <Box
          component="th"
          sx={{ borderBottom: "2px solid #ccc", textAlign: "left", py: 1 }}
        >
          MDRM
        </Box>
        <Box
          component="th"
          sx={{ borderBottom: "2px solid #ccc", textAlign: "left", py: 1 }}
        >
          Search Index
        </Box>
      </Box>
    </Box>

    <Box component="tbody">
      {smartSearchResult?.metadata?.value?.map((mdrm: string, idx: number) => (
        <Box component="tr" key={idx}>
          <Box component="td"
            sx={{
              py: 1,
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": { color: "secondary.main" },
            }}
            onClick={() => handleMdrmClick(mdrm)}>
            {mdrm}
          </Box>
          <Box component="td" sx={{ py: 1 }}>
            80%
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
</Box>

    </Box>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setSmartDialogOpen(false)} variant="contained" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>


<Dialog open={ruleDialogOpen} onClose={() => setRuleDialogOpen(false)} maxWidth="md" fullWidth>
  <DialogTitle>
    {selectedMdrm} — Rule Details
  </DialogTitle>
  <DialogContent dividers>
    <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)} variant="fullWidth">
      <Tab label="Overview" />
      <Tab label="Lineage" />
      <Tab label="Rules" />
      <Tab label="Impact" />
    </Tabs>

    <Box mt={2}>
      {tabIndex === 0 && (
        <Typography>
          <strong>Overview:</strong><br />
          {ruleData?.metadata?.["Rule ID"] || "No overview available"}
        </Typography>
      )}
      {tabIndex === 1 && (
        <Typography>
          <strong>Lineage:</strong><br />
          <code style={{ whiteSpace: "pre-wrap" }}>
          {ruleData?.metadata?.SQL || "No lineage data available"}
          </code>
        </Typography>
      )}
      {tabIndex === 2 && (
        <Typography>
          <strong>Rules:</strong><br />
          <b>Staging Transformation Rule:</b> {ruleData?.metadata?.["Staging Transformation Rule"]} <br />
          <b>Data Mart Transformation Rule:</b> {ruleData?.metadata?.["Data Mart Transformation"]} <br />
          <b>TRL Transformation Rule:</b> {ruleData?.metadata?.["TRL Transformation"] || "No rule content available"}
        </Typography>
      )}
      {tabIndex === 3 && (
        <Typography>
          <strong>Impact:</strong><br />
          {ruleData?.metadata?.["Country"] || "No SQL available"}
        </Typography>
      )}
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setRuleDialogOpen(false)} variant="contained">Close</Button>
  </DialogActions>
</Dialog>






</Container>
  );
}

export default App;